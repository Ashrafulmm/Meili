import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export default async function handler(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // For now, allow all uploads
        // In production, add authentication check here
        
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          maximumSizeInBytes: 5 * 1024 * 1024, // 5 MB
          addRandomSuffix: true,
          prefix: 'products/',
          tokenPayload: clientPayload || '{}',
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('✅ Upload completed:', blob.url);
      },
    });

    return new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export const config = {
  runtime: 'edge',
};
