/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import { PostClient } from "../post-client";
import { BlobRef, BskyAgent, RichText } from "@atproto/api";
import sharp from "sharp";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  PlatformAppCredentials,
  PostMedia,
  PostResult,
  RefreshTokenResult,
  SocialAccount,
} from "../post.types";
import { Main } from "@atproto/api/dist/client/types/app/bsky/richtext/facet";

export class BlueskyPostClient extends PostClient {
  #agent: BskyAgent;
  #charLimit = 300;
  #maxImages = 4;
  #maxFileSize = 976.56 * 1024;
  #requests: any[] = [];
  #responses: any[] = [];

  constructor(
    supabaseClient: SupabaseClient,
    appCredentials: PlatformAppCredentials
  ) {
    super(supabaseClient, appCredentials);
    this.#agent = new BskyAgent({
      service: "https://bsky.social",
    });
  }

  async refreshAccessToken(
    account: SocialAccount
  ): Promise<RefreshTokenResult> {
    try {
      this.#requests.push({ refreshRequest: "Resuming Session" });
      await this.#agent.resumeSession({
        accessJwt: account.access_token,
        refreshJwt: account.refresh_token!,
        handle: account.social_provider_user_name!,
        did: account.social_provider_user_id,
        active: true,
      });

      this.#responses.push({ refreshResponse: "Resumed Session" });
      return {
        access_token: account.access_token,
        refresh_token: account.refresh_token,
        expires_at: account.access_token_expires_at!.toISOString(),
      };
    } catch (error: any) {
      console.error("Failed to resume session", error);
      await this.#agent.login({
        identifier: account.social_provider_user_name!,
        password: account.social_provider_metadata.bluesky_app_password!,
      });

      this.#responses.push({ refreshResponse: "New Session Created" });
      return {
        access_token: this.#agent.session?.accessJwt,
        refresh_token: this.#agent.session?.refreshJwt,
        expires_at: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 365
        ).toISOString(),
      };
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
      const trimmedCaption = caption.slice(0, this.#charLimit);

      // Create a new RichText instance with the caption
      const rt = new RichText({ text: trimmedCaption });
      await rt.detectFacets(this.#agent);

      let embed = null;

      if (media && media.length > 0) {
        const processedMedia = await this.#processMedia({
          caption: trimmedCaption,
          media,
        });
        if (processedMedia.length > 0) {
          embed = {
            $type: "app.bsky.embed.images",
            images: processedMedia,
          };
        }
      } else {
        // Extract the first URL for embedding
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const matches = [...trimmedCaption.matchAll(urlRegex)];

        if (matches.length > 0) {
          const embedUrl = matches[0][0].replace(/[.,;!?)]+$/, "");
          embed = await this.#fetchEmbedCard(embedUrl);
        }
      }

      const postPayload: {
        text: string;
        facets: Main[] | undefined;
        embed?:
          | {
              $type: string;
              external: {
                uri: any;
                title: string | null;
                description: string | null;
                thumb?: BlobRef;
              };
            }
          | {
              $type: string;
              images: {
                alt: any;
                image: BlobRef;
                aspectRatio: {
                  width: number | undefined;
                  height: number | undefined;
                };
              }[];
            };
      } = {
        text: rt.text,
        facets: rt.facets,
      };

      if (embed) {
        postPayload.embed = embed;
      }

      this.#requests.push({ postRequest: postPayload });

      const response = await this.#agent.post(postPayload);

      this.#responses.push({ postResponse: response });
      return {
        post_id: postId,
        provider_connection_id: account.id,
        success: true,
        provider_post_id: response.uri,
        provider_post_url: `https://bsky.app/profile/${
          account.social_provider_user_name
        }/post/${response.uri.split("/").pop()}`,
        details: {
          trimmed: caption.length > trimmedCaption.length,
          requests: this.#requests,
          responses: this.#responses,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        post_id: postId,
        provider_connection_id: account.id,
        success: false,
        error_message: error.message,
        details: {
          error,
          requests: this.#requests,
          responses: this.#responses,
        },
      };
    }
  }

  async #processMedia({
    caption,
    media,
  }: {
    caption: string;
    media: PostMedia[];
  }): Promise<
    {
      alt: string;
      image: BlobRef;
      aspectRatio: {
        width: number | undefined;
        height: number | undefined;
      };
    }[]
  > {
    const images = [];
    const allowedMedia = media.slice(0, this.#maxImages);
    for (const medium of allowedMedia) {
      const isVideo = medium.type === "video";

      if (isVideo) {
        continue;
      }

      const file = await this.getFile(medium);

      const buffer = Buffer.from(await file.arrayBuffer());
      let sharpBuffer = await sharp(buffer).toBuffer();
      const metadata = await sharp(sharpBuffer).metadata();
      const { width, height } = metadata;
      // Resize image if needed
      if (buffer.length > this.#maxFileSize) {
        sharpBuffer = await sharp(sharpBuffer)
          .rotate() // Add this to automatically rotate based on EXIF data
          .resize(2000, 2000, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({
            quality: 80,
          })
          .toBuffer();

        console.log(`Resized to ${sharpBuffer.length} bytes`);

        // If still too large, reduce quality further
        if (sharpBuffer.length > this.#maxFileSize) {
          sharpBuffer = await sharp(sharpBuffer)
            .jpeg({
              quality: 60,
            })
            .toBuffer();
          console.log(`Further compressed to ${sharpBuffer.length} bytes`);
        }
      }

      const uploadResult = await this.#agent.uploadBlob(sharpBuffer, {
        encoding: "image/jpeg",
      });

      images.push({
        alt: caption || "Image",
        image: uploadResult.data.blob,
        aspectRatio: {
          width,
          height,
        },
      });
    }

    return images;
  }

  async #fetchEmbedCard(url: string): Promise<{
    $type: string;
    external: {
      uri: string;
      title: string | null;
      description: string | null;
      thumb?: BlobRef;
    };
  } | null> {
    try {
      // Fetch the webpage
      const response = await fetch(url);
      const html = await response.text();

      // Parse HTML using JSDOM
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Create the card object with required fields
      const card: {
        uri: string;
        title: string | null;
        description: string | null;
        thumb?: BlobRef;
      } = {
        uri: url,
        title: "",
        description: "",
      };

      // Extract metadata
      const titleTag = document.querySelector('meta[property="og:title"]');
      const descriptionTag = document.querySelector(
        'meta[property="og:description"]'
      );
      const imageTag = document.querySelector('meta[property="og:image"]');

      if (titleTag) {
        card.title = titleTag.getAttribute("content");
      } else {
        card.title = document.querySelector("title")?.textContent || "";
      }

      if (descriptionTag) {
        card.description = descriptionTag.getAttribute("content");
      } else {
        const metaDesc = document.querySelector('meta[name="description"]');
        card.description = metaDesc ? metaDesc.getAttribute("content") : "";
      }

      // Handle thumbnail image if present
      if (imageTag) {
        let imageUrl = imageTag.getAttribute("content") || "";

        // Handle relative URLs
        if (!imageUrl.startsWith("http")) {
          const urlObj = new URL(url);
          imageUrl = imageUrl.startsWith("/")
            ? `${urlObj.protocol}//${urlObj.host}${imageUrl}`
            : `${urlObj.protocol}//${urlObj.host}/${imageUrl}`;
        }

        // Fetch and upload the image
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();

        const { data: uploadData } = await this.#agent.uploadBlob(
          new Uint8Array(imageBuffer),
          {
            encoding: imageResponse.headers.get("content-type") || "image/jpeg",
          }
        );

        if (uploadData?.blob) {
          card.thumb = uploadData.blob;
        }
      }

      return {
        $type: "app.bsky.embed.external",
        external: card,
      };
    } catch (error) {
      console.error("Error creating embed card:", error);
      return null;
    }
  }
}
