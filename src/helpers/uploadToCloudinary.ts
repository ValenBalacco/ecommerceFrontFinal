import { uploadImageToCloudinary, CloudinaryUploadResponse } from "../services/cloudinaryService";

/**
 * Sube una imagen a Cloudinary y retorna la respuesta.
 * @param file Archivo de imagen a subir.
 * @returns CloudinaryUploadResponse con la información de la imagen subida.
 */
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