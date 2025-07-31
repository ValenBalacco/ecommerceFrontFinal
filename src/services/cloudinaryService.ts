// Este servicio sube imágenes a Cloudinary usando su API REST.
// Necesitas tu upload_preset y cloud_name de Cloudinary.

export interface CloudinaryUploadResponse {
  url: string;
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

export const uploadImageToCloudinary = async (
  file: File,
  uploadPreset: string,
  cloudName: string
): Promise<CloudinaryUploadResponse> => {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al subir la imagen a Cloudinary");
  }

  return response.json();
};