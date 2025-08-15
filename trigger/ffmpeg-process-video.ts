import { logger, task } from "@trigger.dev/sdk";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import { Database } from "@post-for-me/db";

// Constants
const DEFAULT_FRAME_RATE = 24;
const MIN_FRAME_RATE = 23;
const MAX_FRAME_RATE = 60;
const ASPECT_RATIOS = {
  VERTICAL: { ratio: 9 / 16, maxWidth: 1080, maxHeight: 1920 },
  LANDSCAPE: { ratio: 16 / 9, maxWidth: 1920, maxHeight: 1080 },
  SQUARE: { ratio: 1, maxWidth: 1080, maxHeight: 1080 },
  CLASSIC: { ratio: 4 / 3, maxWidth: 1440, maxHeight: 1080 },
};

// Optimized aspect ratio detection
const detectAspectRatio = (width: number, height: number) => {
  const ratio = width / height;
  const tolerance = 0.1;
  return (
    Object.values(ASPECT_RATIOS).find(
      (ar) => Math.abs(ratio - ar.ratio) <= tolerance
    ) || ASPECT_RATIOS.LANDSCAPE
  ); // Default to landscape if no match
};

// Single Supabase client instance
const supabaseClient = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const getFileKeyFromPublicUrl = (
  publicUrl: string,
  bucket: string
): string | null => {
  const pattern = new RegExp(`/storage/v1/object/public/${bucket}/(.+)$`);
  const match = publicUrl.match(pattern);
  return match ? match[1] : null;
};

export const ffmpegProcessVideo = task({
  id: "ffmpeg-process-video",
  maxDuration: 800,
  retry: { maxAttempts: 2 },
  machine: "medium-2x",
  run: async ({ medium: { url } }: { medium: { url: string } }) => {
    logger.info("Starting video processing", { url });
    const tempDir = os.tmpdir();
    const bucket = "post-media";
    const key = getFileKeyFromPublicUrl(url, bucket);

    if (!key) {
      logger.error("Unable to get key from url", { url });
      throw new Error("Unable to get key from url");
    }

    const filename = key.split("/").pop()!;
    const inputPath = path.join(tempDir, filename);
    const outputPath = path.join(tempDir, `out_${Date.now()}.mp4`);
    let fileProcessed = false;

    try {
      logger.info("Downloading video from signed URL");
      const videoResponse = await fetch(url);
      if (!videoResponse.body) throw new Error("Failed to fetch video");

      logger.info("Writing video to temporary file", { inputPath });
      const buffer = await videoResponse.arrayBuffer();
      await fs.writeFile(inputPath, Buffer.from(buffer));

      logger.info("Probing video metadata");
      const metadata = await new Promise<any>((resolve, reject) => {
        ffmpeg.ffprobe(inputPath, (err: any, data: any) => {
          if (err) reject(err);
          else resolve(data);
        });
      });

      const videoStream = metadata.streams.find(
        (s: any) => s.codec_type === "video"
      );
      const audioStream = metadata.streams.find(
        (s: any) => s.codec_type === "audio"
      );

      if (!videoStream) {
        throw new Error("No video stream found in file");
      }

      const { width, height } = videoStream;
      const frameCount = videoStream.nb_frames || 0;
      const { duration } = metadata.format;
      const frameRate =
        frameCount > 0
          ? Math.round(parseInt(frameCount) / duration)
          : DEFAULT_FRAME_RATE;
      const aspectRatio = detectAspectRatio(width, height);
      const hasAudio = !!audioStream;
      const videoCodec = videoStream.codec_name || "";

      // Get format extension and check if it's an MP4 file
      const formatExt = path.extname(filename).toLowerCase().substring(1);
      const isMP4 = metadata.format.format_name.includes("mp4");

      logger.info("Video metadata analysis", {
        width,
        height,
        frameRate,
        duration,
        hasAudio,
        videoCodec,
        format: metadata.format,
        audioChannels: audioStream ? audioStream.channels : 0,
        aspectRatio: `${aspectRatio.maxWidth}x${aspectRatio.maxHeight}`,
        formatExt,
        isMP4,
      });

      // Check if the video meets Facebook audio requirements
      const hasValidAudio =
        !hasAudio ||
        (audioStream &&
          audioStream.sample_rate <= 48000 && // Facebook requires up to 48kHz
          (audioStream.channels === 1 || audioStream.channels === 2) && // Mono or Stereo
          audioStream.codec_name === "aac"); // AAC codec

      const needsProcessingForBitrate = metadata.format.bit_rate > 25000000;

      // Always process non-MP4 files
      if (!isMP4) {
        logger.info("Non-MP4 file detected - will process to MP4");
      }

      // Early exit conditions - Only MP4 files that meet all other requirements can skip processing
      if (
        isMP4 &&
        !needsProcessingForBitrate &&
        frameRate >= MIN_FRAME_RATE &&
        frameRate <= MAX_FRAME_RATE &&
        width <= aspectRatio.maxWidth &&
        height <= aspectRatio.maxHeight &&
        hasValidAudio
      ) {
        logger.info("video already meets requirements, skipping processing");
        return;
      }

      if (needsProcessingForBitrate) {
        logger.info("Video bitrate exceeds 25Mbps, forcing processing.", {
          currentBitrate: metadata.format.bit_rate,
        });
      }

      logger.info("Video needs processing", {
        needsMP4Conversion: !isMP4,
        needsAudioProcessing: !hasValidAudio,
        format: metadata.format.format_name,
        triggeredByHighBitrate: needsProcessingForBitrate,
      });

      // Optimize scaling calculations
      const scaleRatio = Math.min(
        aspectRatio.maxWidth / width,
        aspectRatio.maxHeight / height,
        1 // Prevent upscaling
      );

      const targetWidth =
        scaleRatio < 1 ? Math.round((width * scaleRatio) / 2) * 2 : width;
      const targetHeight =
        scaleRatio < 1 ? Math.round((height * scaleRatio) / 2) * 2 : height;

      let videoEncodingOptions: string[];

      if (needsProcessingForBitrate) {
        // Original input bitrate > 25Mbps
        logger.info(
          "Input bitrate > 25Mbps (needsProcessingForBitrate=true), using target bitrate (-b:v 24M) for processing.",
          { inputBitrate: metadata.format.bit_rate }
        );
        videoEncodingOptions = ["-b:v 24M", "-maxrate 25M", "-bufsize 50M"];
      } else {
        // Input bitrate <= 25Mbps OR unknown. Use CRF. This path is also taken if processing for non-bitrate reasons (e.g. container change, other MP4 validation failures)
        logger.info(
          "Input bitrate <= 25Mbps or unknown (needsProcessingForBitrate=false), using CRF for processing.",
          { inputBitrate: metadata.format.bit_rate }
        );
        videoEncodingOptions = ["-crf 23", "-maxrate 25M", "-bufsize 50M"];
      }

      const ffmpegOptions: string[] = [
        "-c:v libx264",
        "-preset ultrafast",
        ...videoEncodingOptions, // Spread the chosen encoding options
        "-profile:v high",
        "-level 4.0",
        "-pix_fmt yuv420p",
        "-movflags +faststart",
        ...(frameRate < MIN_FRAME_RATE || frameRate > MAX_FRAME_RATE
          ? [`-r ${DEFAULT_FRAME_RATE}`, `-vf fps=${DEFAULT_FRAME_RATE}`]
          : []),
        `-vf scale=${targetWidth}:${targetHeight}`,
      ];

      // Audio settings
      if (hasAudio && audioStream) {
        ffmpegOptions.push("-c:a aac", "-b:a 128k", "-ac 2", "-ar 44100");
      } else {
        ffmpegOptions.push("-an"); // No audio
      }

      logger.info("Starting FFmpeg processing", {
        targetWidth,
        targetHeight,
        scaleRatio,
        ffmpegOptions,
      });

      // Optimized FFmpeg command
      const ffmpegCommand = ffmpeg(inputPath)
        .outputOptions(ffmpegOptions)
        .output(outputPath);

      await new Promise((resolve, reject) => {
        ffmpegCommand
          .on("end", () => {
            logger.info("FFmpeg processing completed");
            resolve(null);
          })
          .on("error", (err: any) => {
            logger.error("FFmpeg processing failed", { error: err });
            reject(err);
          })
          .run();
      });

      fileProcessed = true;
      logger.info("Reading processed video file");
      const processedVideo = await fs.readFile(outputPath);

      logger.info("Uploading processed video to storage");
      const { error } = await supabaseClient.storage
        .from(bucket)
        .upload(key, processedVideo, {
          contentType: "video/mp4",
          cacheControl: "public, max-age=31536000",
          upsert: true,
        });

      if (error) throw new Error(`Upload failed: ${error.message}`);

      logger.info("Video processing completed successfully", {
        key: key,
        bucket,
        processed: true,
      });
      return;
    } catch (e) {
      logger.error("Error processing video", { error: e });
      throw e;
    } finally {
      // Parallel cleanup
      logger.info("Cleaning up temporary files");
      await Promise.all(
        [
          fs
            .unlink(inputPath)
            .catch((e) => logger.error("Input cleanup failed", { error: e })),
          fileProcessed &&
            fs
              .unlink(outputPath)
              .catch((e) =>
                logger.error("Output cleanup failed", { error: e })
              ),
        ].filter(Boolean)
      );
    }
  },
});
