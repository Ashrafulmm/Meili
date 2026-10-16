import { supabase, isSupabaseConfigured } from './supabase';

const BUCKET_NAME = 'product-images';

/**
 * Upload an image file to Supabase Storage
 * Returns the public URL of the uploaded image
 */
export async function uploadImage(file: File, folder: string = 'products'): Promise<string> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error('Upload error:', error);
    
    // Provide helpful error messages
    if (error.message.includes('bucket not found')) {
      throw new Error('Storage bucket "product-images" does not exist. Please run the SQL schema to create it.');
    }
    if (error.message.includes('new row violates row-level security')) {
      throw new Error('Permission denied. Make sure you are logged in as an admin user.');
    }
    
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Upload multiple images at once
 */
export async function uploadMultipleImages(files: File[], folder: string = 'products'): Promise<string[]> {
  const uploadPromises = files.map(file => uploadImage(file, folder));
  return Promise.all(uploadPromises);
}

/**
 * Delete an image from storage
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured.');
  }

  // Extract path from URL
  const urlParts = imageUrl.split('/storage/v1/object/public/');
  if (urlParts.length < 2) {
    throw new Error('Invalid image URL');
  }

  const path = urlParts[1];

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([path]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * Check if storage bucket exists
 */
export async function checkStorageBucket(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error('Error listing buckets:', error);
      return false;
    }
    return data?.some(b => b.name === BUCKET_NAME) || false;
  } catch (err) {
    console.error('Error checking storage bucket:', err);
    return false;
  }
}
