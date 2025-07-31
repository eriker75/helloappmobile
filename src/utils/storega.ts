import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import { supabase } from "./supabase";

export const uploadImageToStorage = async (
  fileUri: string,
  bucketName: string
): Promise<{ path: string; url: string }> => {
  try {
    const fileExtension = fileUri.split(".").pop()?.toLowerCase() || "jpg";
    const finalFileName = `images/${Date.now()}.${fileExtension}`;

    // Read the file as base64
    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert to ArrayBuffer
    const buffer = Buffer.from(fileContent, "base64");
    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(finalFileName, arrayBuffer, {
        contentType: `image/${
          fileExtension === "jpg" ? "jpeg" : fileExtension
        }`,
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error("Error en uploadImageToStorage:", {
      error,
      fileUri,
      bucketName,
    });
    throw error;
  }
};

export const uploadMultipleImages = async (
  fileUris: string[],
  bucketName: string
): Promise<{ path: string; url: string }[]> => {
  try {
    const uploadPromises = fileUris.map((fileUri, index) => {
      return uploadImageToStorage(fileUri, bucketName);
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw error;
  }
};
