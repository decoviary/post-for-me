/* eslint-disable @typescript-eslint/require-await */
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  BlueskyConfiguration,
  FacebookConfiguration,
  InstagramConfiguration,
  LinkedinConfiguration,
  PinterestConfiguration,
  PlatformAppCredentials,
  PostMedia,
  PostResult,
  RefreshTokenResult,
  SocialAccount,
  ThreadsConfiguration,
  TiktokConfiguration,
  TwitterConfiguration,
  YoutubeConfiguration,
} from "./post.types";

export class PostClient {
  #supabaseClient: SupabaseClient;
  #appCredentials: PlatformAppCredentials;

  constructor(
    supabaseClient: SupabaseClient,
    appCredentials: PlatformAppCredentials
  ) {
    this.#supabaseClient = supabaseClient;
    this.#appCredentials = appCredentials;
  }

  //##ABSTRACT METHODS##
  async refreshAccessToken(
    account: SocialAccount
  ): Promise<RefreshTokenResult> {
    //Implement at platform level
    console.log(account);
    return {
      access_token: account.access_token,
      refresh_token: account.refresh_token,
      expires_at: account.access_token_expires_at!.toISOString(),
    };
  }

  /**
   *
   * @param {*} account : {id: string, platform: string, platform_user_id: string, platform_username: string, access_token: string, refresh_token: string, expires_at: string}
   * @param {*} caption : string
   * @param {*} media : {id: string, bucket: string, key: string, type: 'image' | 'video'}[]
   * @param {*} platformConfig
   * @returns
   */
  async post({
    postId,
    account,
    caption,
    media,
    platformConfig,
  }: {
    postId: string;
    account: SocialAccount;
    caption: string;
    media: PostMedia[];
    platformConfig:
      | PinterestConfiguration
      | InstagramConfiguration
      | TiktokConfiguration
      | TwitterConfiguration
      | YoutubeConfiguration
      | FacebookConfiguration
      | LinkedinConfiguration
      | BlueskyConfiguration
      | ThreadsConfiguration;
  }): Promise<PostResult> {
    //Implement at platform level
    console.log(postId, account, caption, media, platformConfig);
    return {
      post_id: postId,
      provider_connection_id: account.id,
      success: false,
    };
  }

  //##HELPER METHODS##
  /**
   *
   * @param {*} medium : {id: string, bucket: string, key: string, type: 'image' | 'video'}
   * @returns File
   */
  async getFile(medium: PostMedia) {
    try {
      const response = await fetch(medium.url);
      const data = await response.blob();

      if (!data) {
        throw new Error("Failed to get file");
      }

      const filename = medium.url.split("/").pop() ?? "file";

      return new File([data], filename, {
        type: data.type,
      });
    } catch (error) {
      console.error("Error getting file from supa:", error);
      throw error;
    }
  }

  /**
   *
   * @param {*} media : {id: string, bucket: string, key: string, type: 'image' | 'video'}
   * @returns string
   */
  async getSignedUrlForFile(medium: PostMedia) {
    try {
      return medium.url;
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw new Error("Failed to generate signed URL for file");
    }
  }
}
