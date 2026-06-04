import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  url: string;
  publicId: string;
  resourceType: string;
  width?: number;
  height?: number;
}

/**
 * Upload a file buffer to Cloudinary.
 * Handles both images and videos via resource_type: "auto".
 */
export function uploadToCloudinary(
  buffer: Buffer,
  folder = "portfolio"
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          width: result.width,
          height: result.height,
        });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string, resourceType = "image") {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export default cloudinary;
