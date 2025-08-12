/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import { SupabaseClient } from "@supabase/supabase-js";
import { PostClient } from "../post-client";
import axios from "axios";
import FormData from "form-data";
import {
  PlatformAppCredentials,
  PostMedia,
  PostResult,
  RefreshTokenResult,
  SocialAccount,
} from "../post.types";

export class FacebookPostClient extends PostClient {
  #requests: any[] = [];
  #responses: any[] = [];
  #appCredentials: PlatformAppCredentials;

  constructor(
    supabaseClient: SupabaseClient,
    appCredentials: PlatformAppCredentials
  ) {
    super(supabaseClient, appCredentials);
    this.#appCredentials = appCredentials;
  }

  async refreshAccessToken(
    account: SocialAccount
  ): Promise<RefreshTokenResult> {
    try {
      const refreshParams = {
        grant_type: "fb_exchange_token",
        client_id: this.#appCredentials.app_id,
        client_secret: this.#appCredentials.app_secret,
        fb_exchange_token: account.access_token,
      };
      this.#requests.push({
        refreshRequest: "https://graph.facebook.com/v20.0/oauth/access_token",
        params: refreshParams,
      });
      const response = await axios.get(
        "https://graph.facebook.com/v20.0/oauth/access_token",
        {
          params: refreshParams,
        }
      );
      this.#responses.push({ refreshResponse: response.data });

      if (!response.data.access_token) {
        console.error("Failed to refresh Facebook token", response.data);
        throw new Error("No access token in refresh response");
      }

      return {
        access_token: response.data.access_token,
        expires_at: new Date(
          Date.now() + 60 * 24 * 60 * 60 * 1000
        ).toISOString(),
      };
    } catch (error) {
      console.error(
        "Error refreshing Facebook token:",
        error.response?.data || error
      );
      throw error;
    }
  }

  async post({
    postId,
    account,
    caption,
    media,
  }: {
    postId: string;
    account: SocialAccount;
    caption: string;
    media: PostMedia[];
  }): Promise<PostResult> {
    try {
      let platformId;

      switch (true) {
        case media.length === 0: {
          platformId = await this.#createTextPost({ account, caption });
          break;
        }
        case media.length === 1: {
          // For single media posts (image or video)
          const medium = media[0];

          if (medium.type === "video") {
            platformId = await this.#publishVideo({ account, caption, medium });
            return {
              success: true,
              provider_connection_id: account.id,
              post_id: postId,
              provider_post_id: platformId,
              provider_post_url: `https://facebook.com/${account.social_provider_user_id}/videos/${platformId}`,
              details: {
                requests: this.#requests,
                responses: this.#responses,
              },
            };
          }

          platformId = await this.#createMediaPost({
            account,
            caption,
            medium,
          });
          break;
        }
        case media.length > 1: {
          platformId = await this.#createCarouselPost({
            account,
            caption,
            media,
          });
          break;
        }
      }

      this.#requests.push({
        postRequest: {
          url: `https://graph.facebook.com/v20.0/${platformId}`,
          params: {
            fields: "permalink_url",
            access_token: account.access_token,
          },
        },
      });
      // Get the permalink URL for non-video posts
      const postResponse = await axios.get(
        `https://graph.facebook.com/v20.0/${platformId}`,
        {
          params: {
            fields: "permalink_url",
            access_token: account.access_token,
          },
        }
      );

      this.#responses.push({ postResponse: postResponse.data });

      return {
        success: true,
        post_id: postId,
        provider_connection_id: account.id,
        provider_post_id: platformId,
        provider_post_url: postResponse.data.permalink_url,
        details: {
          requests: this.#requests,
          responses: this.#responses,
        },
      };
    } catch (error) {
      console.error(
        "Error posting to Facebook:",
        error.response?.data || error
      );
      return {
        success: false,
        post_id: postId,
        provider_connection_id: account.id,
        details: {
          error,
          requests: this.#requests,
          responses: this.#responses,
        },
        error_message: `Failed to post to Facebook ${
          error.response?.data?.error?.message || error.message
        }`,
      };
    }
  }

  async #createTextPost({
    account,
    caption,
  }: {
    account: SocialAccount;
    caption: string;
  }): Promise<string> {
    this.#requests.push({
      createTextRequest: {
        url: `https://graph.facebook.com/v20.0/${account.social_provider_user_id}/feed`,
        body: {
          message: caption,
          access_token: account.access_token,
          published: true,
        },
      },
    });

    const response = await axios.post(
      `https://graph.facebook.com/v20.0/${account.social_provider_user_id}/feed`,
      {
        message: caption,
        access_token: account.access_token,
        published: true,
      }
    );

    this.#responses.push({ createTextResponse: response.data });

    if (response.data.error) {
      throw new Error(`Failed to post: ${response.data.error.message}`);
    }
    return response.data.id;
  }

  async #createMediaPost({
    account,
    caption,
    medium,
  }: {
    account: SocialAccount;
    caption: string;
    medium: PostMedia;
  }): Promise<string> {
    const isVideo = medium.type === "video";
    const file = await this.getFile(medium);
    const buffer = Buffer.from(await file.arrayBuffer());
    const originalFilename = file.name || "FileUpload";
    const lastDotIndex = originalFilename.lastIndexOf(".");
    const baseFilename =
      lastDotIndex > 0
        ? originalFilename.substring(0, lastDotIndex)
        : originalFilename;

    const form = new FormData();
    form.append("access_token", account.access_token);
    form.append(isVideo ? "description" : "message", caption);
    form.append("file", buffer, {
      filename: `${baseFilename}.${isVideo ? "mp4" : "jpg"}`,
      contentType: isVideo ? "video/mp4" : "image/jpeg",
    });

    const endpoint = isVideo ? "videos" : "photos";
    const baseUrl = isVideo
      ? "https://graph-video.facebook.com/v20.0"
      : "https://graph.facebook.com/v20.0";

    this.#requests.push({
      createMediaRequest: {
        url: `${baseUrl}/${account.social_provider_user_id}/${endpoint}`,
        file: `${baseFilename}.${isVideo ? "mp4" : "jpg"}`,
      },
    });

    const createMediaResponse = await axios.post(
      `${baseUrl}/${account.social_provider_user_id}/${endpoint}`,
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    this.#responses.push({ createMediaResponse: createMediaResponse.data });

    if (createMediaResponse.data.error) {
      throw new Error(
        `Failed to upload media: ${createMediaResponse.data.error.message}`
      );
    }

    return createMediaResponse.data.post_id || createMediaResponse.data.id;
  }

  async #createCarouselPost({
    account,
    caption,
    media,
  }: {
    account: SocialAccount;
    caption: string;
    media: PostMedia[];
  }): Promise<string> {
    const mediaIds = [];

    // Upload each image
    for (const medium of media) {
      const file = await this.getFile(medium);
      const buffer = Buffer.from(await file.arrayBuffer());
      const originalFilename = file.name || "FileUpload";
      const lastDotIndex = originalFilename.lastIndexOf(".");
      const baseFilename =
        lastDotIndex > 0
          ? originalFilename.substring(0, lastDotIndex)
          : originalFilename;

      const form = new FormData();
      form.append("access_token", account.access_token);
      form.append("published", "false"); // Important for carousel
      form.append("file", buffer, {
        filename: `${baseFilename}.jpg`,
        contentType: "image/jpeg",
      });

      this.#requests.push({
        createCarouselItemRequest: {
          url: `https://graph.facebook.com/v20.0/${account.social_provider_user_id}/photos`,
          file: `${baseFilename}.jpg`,
        },
      });

      const uploadResponse = await axios.post(
        `https://graph.facebook.com/v20.0/${account.social_provider_user_id}/photos`,
        form,
        {
          headers: {
            ...form.getHeaders(),
          },
        }
      );

      this.#responses.push({ createCarouselItemResponse: uploadResponse.data });

      if (uploadResponse.data.error) {
        throw new Error(
          `Failed to upload image: ${uploadResponse.data.error.message}`
        );
      }
      mediaIds.push({ media_fbid: uploadResponse.data.id });
    }

    this.#requests.push({
      createCarouselPostRequest: {
        url: `https://graph.facebook.com/v20.0/${account.social_provider_user_id}/feed`,
        body: {
          message: caption,
          access_token: account.access_token,
          attached_media: mediaIds,
        },
      },
    });

    // Create the carousel post
    const response = await axios.post(
      `https://graph.facebook.com/v20.0/${account.social_provider_user_id}/feed`,
      {
        message: caption,
        access_token: account.access_token,
        attached_media: mediaIds,
      }
    );

    this.#responses.push({ createCarouselPostResponse: response.data });

    if (response.data.error) {
      throw new Error(
        `Failed to create carousel: ${response.data.error.message}`
      );
    }

    return response.data.id;
  }

  async #publishVideo({
    account,
    caption,
    medium,
  }: {
    account: SocialAccount;
    caption: string;
    medium: PostMedia;
  }): Promise<string> {
    const fileUrl = await this.getSignedUrlForFile(medium);
    this.#requests.push({
      videoRequest: {
        url: `https://graph-video.facebook.com/v20.0/${account.social_provider_user_id}/videos`,
        data: {
          file_url: fileUrl,
          description: caption,
          access_token: account.access_token,
        },
      },
    });
    const videoResponse = await axios.post(
      `https://graph-video.facebook.com/v20.0/${account.social_provider_user_id}/videos`,
      {
        file_url: fileUrl,
        description: caption,
        access_token: account.access_token,
      }
    );

    const videoResponseData = videoResponse.data;

    this.#responses.push({ videoResponse: videoResponseData });

    if (videoResponseData?.error) {
      console.error(videoResponseData);
      throw new Error(
        `Failed to publish video: ${videoResponseData.error.message}`
      );
    }

    let status = "processing";
    let statusResponse;
    let attempts = 0;
    const delay = 5000;
    const maxAttempts = 48;

    while (status === "processing" && attempts < maxAttempts) {
      this.#requests.push({
        statusRequest: {
          url: `https://graph.facebook.com/${videoResponseData.id}?fields=status`,
        },
      });
      statusResponse = await axios.get(
        `https://graph.facebook.com/${videoResponseData.id}?fields=status`,
        {
          headers: {
            Authorization: `OAuth ${account.access_token}`,
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      );

      this.#responses.push({ statusResponse: statusResponse.data });

      status = statusResponse.data?.status?.video_status;
      attempts++;

      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (status === "error") {
      throw new Error(`Failed to process video`);
    }

    return videoResponseData.id;
  }
}
