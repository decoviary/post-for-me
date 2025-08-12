import { logger, task } from "@trigger.dev/sdk/v3";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";

import { Database } from "@post-for-me/db";

// Single Supabase client instance
const supabaseClient = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper function to determine media type
const getMediaType = (
  contentType: string,
  fileExtension: string
): "image" | "video" => {
  const imageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];
  const videoTypes = [
    "video/mp4",
    "video/webm",
    "video/mov",
    "video/avi",
    "video/quicktime",
  ];
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".qt"];

  const normalizedFileExtension = fileExtension.toLowerCase();

  if (imageTypes.includes(contentType)) {
    return "image";
  } else if (videoTypes.includes(contentType)) {
    return "video";
  } else if (imageExtensions.includes(normalizedFileExtension)) {
    return "image";
  } else if (videoExtensions.includes(normalizedFileExtension)) {
    return "video";
  }

  return "image"; // Default to image if uncertain
};

// Helper function to get file extension from URL or content type
const getFileExtension = (url: string, contentType?: string): string => {
  const urlExtension = path.extname(new URL(url).pathname);
  if (urlExtension) return urlExtension;

  if (contentType) {
    const mimeToExt: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
      "video/mp4": ".mp4",
      "video/webm": ".webm",
      "video/mov": ".mov",
      "video/avi": ".avi",
    };
    return mimeToExt[contentType] || ".bin";
  }

  return ".bin";
};

// Helper function to stream download and upload file
const streamDownloadAndUpload = async (fileUrl: string, prefix: string) => {
  logger.info(`Streaming download from: ${fileUrl}`);

  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }

  if (!response.body) {
    throw new Error("No response body available for streaming");
  }

  const contentType =
    response.headers.get("content-type") || "application/octet-stream";
  const contentLength = response.headers.get("content-length");
  const fileExtension = getFileExtension(fileUrl, contentType);
  const fileName = `${prefix}_${uuidv4()}`;
  const mediaType = getMediaType(contentType, fileExtension);

  logger.info(`Streaming upload to Supabase: ${fileName}`, {
    contentType,
    mediaType,
    contentLength: contentLength ? `${contentLength} bytes` : "unknown",
  });

  // Upload directly from stream to Supabase
  const { error } = await supabaseClient.storage
    .from("post-media")
    .upload(fileName, response.body, {
      contentType,
      duplex: "half",
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  logger.info(`File streamed and uploaded successfully: ${fileName}`);

  // Get public URL
  const { data: publicUrlData } = supabaseClient.storage
    .from("post-media")
    .getPublicUrl(fileName);

  return {
    publicUrl: publicUrlData.publicUrl,
    mediaType,
  };
};

export const processPostMedium = task({
  id: "process-post-medium",
  maxDuration: 800,
  retry: { maxAttempts: 3 },
  machine: "medium-2x",
  run: async ({
    medium: {
      url,
      thumbnail_url,
      provider,
      provider_connection_id,
      thumbnail_timestamp_ms,
    },
  }: {
    medium: {
      provider?: string | null;
      provider_connection_id?: string | null;
      url: string;
      thumbnail_url?: string | null;
      thumbnail_timestamp_ms?: number | null;
    };
  }): Promise<{
    provider?: string | null;
    provider_connection_id?: string | null;
    url: string;
    thumbnail_url: string;
    thumbnail_timestamp_ms?: number | null;
    type: string;
  }> => {
    logger.info("Starting media processing", { url, thumbnail_url });

    try {
      // Stream download and upload main media file
      let mediaResult: {
        publicUrl: string;
        mediaType: "image" | "video";
      } | null = null;
      let thumbnailResult: { publicUrl: string } | null = null;

      if (url) {
        mediaResult = await streamDownloadAndUpload(url, "media");
      }

      // Stream download and upload thumbnail if provided
      if (thumbnail_url) {
        thumbnailResult = await streamDownloadAndUpload(
          thumbnail_url,
          "thumbnail"
        );
      }

      if (!mediaResult) {
        throw new Error("No media URL provided");
      }

      const result = {
        url: mediaResult.publicUrl,
        thumbnail_url: thumbnailResult?.publicUrl || "",
        type: mediaResult.mediaType,
        provider: provider,
        provider_connection_id: provider_connection_id,
        thumbnail_timestamp_ms: thumbnail_timestamp_ms,
      };

      logger.info("Media processing completed successfully", result);

      return result;
    } catch (error) {
      logger.error("Error processing media", { error: error.message });
      throw error;
    }
  },
});
