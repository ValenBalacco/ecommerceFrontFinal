import { uploadImageToCloudinary, CloudinaryUploadResponse } from "../services/cloudinaryService";

export const uploadToCloudinary = async (
  file: File,
  uploadPreset: string,
  cloudName: string
): Promise<CloudinaryUploadResponse> => {
  try {
    const response = await uploadImageToCloudinary(file, uploadPreset, cloudName);
    return response;
  } catch (error) {
    throw new Error("No se pudo subir la imagen a Cloudinary");
  }
};