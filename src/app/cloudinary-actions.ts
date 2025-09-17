'use server';

import {v2 as cloudinary} from 'cloudinary';

// IMPORTANT: You must fill in these values in your .env file.
// You can find them in your Cloudinary dashboard under Settings > API Keys.
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(imageDataUri: string): Promise<{ message: string; url?: string; error?: boolean }> {
  // Check if Cloudinary is configured.
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return {
      message: "Cloudinary credentials are not configured. Please check your .env file.",
      error: true,
    }
  }

  try {
    // The 'upload' method uploads the image to your Cloudinary account.
    const result = await cloudinary.uploader.upload(imageDataUri, {
      folder: "contentflow-ai", // Optional: saves images in a specific folder.
    });

    // The 'secure_url' is the public URL of the uploaded image.
    return {
      message: "Image uploaded successfully.",
      url: result.secure_url,
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during upload.';
    console.error("Cloudinary Upload Error:", errorMessage);
    return {
      message: `Failed to upload image: ${errorMessage}`,
      error: true,
    };
  }
}
