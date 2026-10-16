import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { upload } from '@vercel/blob/client';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const invalidFiles = files.filter(f => !validTypes.includes(f.type));
    if (invalidFiles.length > 0) {
      alert('Invalid file type. Please upload JPG, PNG, WebP, or GIF images only.');
      return;
    }

    // Validate file size (max 5MB)
    const tooLarge = files.filter(f => f.size > 5 * 1024 * 1024);
    if (tooLarge.length > 0) {
      alert('File too large. Maximum size is 5MB per image.');
      return;
    }

    // Check max images limit
    const remainingSlots = maxImages - images.filter(img => img.trim() !== '').length;
    if (files.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more image(s).`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Upload to Vercel Blob via serverless function
        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        
        newUrls.push(blob.url);
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      // Filter out empty strings and add new URLs
      const currentImages = images.filter(img => img.trim() !== '');
      onChange([...currentImages, ...newUrls]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages.length > 0 ? newImages : ['']);
  };

  const updateImageUrl = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;
    onChange(newImages);
  };

  const addManualUrl = () => {
    onChange([...images.filter(img => img.trim() !== ''), '']);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-color-1 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> Product images
        </h3>
        <div className="flex gap-2">
          <label className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-color-4 text-color-4 rounded-sm hover:bg-color-4 hover:text-color-8 transition-colors duration-150 cursor-pointer">
            <Upload className="w-3 h-3" />
            Upload
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <button
            type="button"
            onClick={addManualUrl}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-color-6 text-color-2 rounded-sm hover:border-color-4 hover:text-color-1 transition-colors duration-150"
          >
            + Add URL
          </button>
        </div>
      </div>

      {uploading && (
        <div className="flex items-center gap-2 p-3 bg-color-7 rounded-sm">
          <Loader2 className="w-4 h-4 text-color-3 animate-spin" />
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-color-1">Uploading to Vercel Blob...</span>
              <span className="text-color-2">{uploadProgress}%</span>
            </div>
            <div className="h-1.5 bg-color-6 rounded-full overflow-hidden">
              <div
                className="h-full bg-color-3 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {images.map((img, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={img}
                onChange={e => updateImageUrl(index, e.target.value)}
                placeholder={index === 0 ? 'Main image URL' : `Image ${index + 1} URL`}
                className="w-full px-4 py-2 text-sm bg-color-8 border-2 border-color-6 rounded-sm focus:border-color-3 focus:ring-2 focus:ring-color-3/20 transition-all duration-150 text-color-1 placeholder:text-color-2/50"
              />
              {index === 0 && img && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-color-3 font-medium bg-color-7 px-2 py-0.5 rounded-sm">Main</span>
              )}
            </div>
            {img && (
              <img src={img} alt="" className="w-10 h-10 object-cover rounded-sm border border-color-6 shrink-0" />
            )}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="p-2 text-color-2 hover:text-red-600 transition-colors duration-150 shrink-0"
              aria-label={`Remove image ${index + 1}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-color-2">
        {images.filter(img => img.trim() !== '').length} / {maxImages} images • First image is the main photo
      </p>
    </div>
  );
}
