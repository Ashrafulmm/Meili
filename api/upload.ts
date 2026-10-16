import { put } from '@vercel/blob';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse multipart form data
    const chunks: Uint8Array[] = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    // Extract file from form data
    const boundary = req.headers['content-type']?.split('boundary=')[1];
    if (!boundary) {
      return res.status(400).json({ error: 'No boundary found in content-type' });
    }

    const parts = buffer.toString('binary').split(`--${boundary}`);
    let fileBuffer: Buffer | null = null;
    let fileName = 'upload.jpg';
    let contentType = 'image/jpeg';

    for (const part of parts) {
      if (part.includes('name="file"') && part.includes('filename=')) {
        const filenameMatch = part.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          fileName = filenameMatch[1];
        }

        const contentTypeMatch = part.match(/Content-Type: ([^\r\n]+)/i);
        if (contentTypeMatch) {
          contentType = contentTypeMatch[1];
        }

        // Extract the actual file data (after the double newline)
        const fileStart = part.indexOf('\r\n\r\n') + 4;
        const fileEnd = part.lastIndexOf('\r\n');
        if (fileStart > 3 && fileEnd > fileStart) {
          fileBuffer = Buffer.from(part.substring(fileStart, fileEnd), 'binary');
        }
      }
    }

    if (!fileBuffer) {
      return res.status(400).json({ error: 'No file found in upload' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(contentType)) {
      return res.status(400).json({ 
        error: 'Invalid file type. Only JPG, PNG, WebP, and GIF are allowed.' 
      });
    }

    // Validate file size (5MB max)
    if (fileBuffer.length > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }

    // Convert Buffer to Blob for Vercel Blob
    const blob = new Blob([fileBuffer], { type: contentType });
    
    // Upload to Vercel Blob
    const uploadedBlob = await put(`products/${Date.now()}-${fileName}`, blob, {
      access: 'public',
      addRandomSuffix: true,
    });

    console.log('✅ Upload completed:', uploadedBlob.url);

    return res.status(200).json({
      url: uploadedBlob.url,
      pathname: uploadedBlob.pathname,
      contentType: uploadedBlob.contentType,
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    return res.status(500).json({ error: (error as Error).message });
  }
}
