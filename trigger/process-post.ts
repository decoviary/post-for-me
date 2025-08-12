import { logger, task } from "@trigger.dev/sdk/v3";
import { createClient } from "@supabase/supabase-js";
import type {
  IndividualPostData,
  PlatformAppCredentials,
  PlatformConfiguration,
  Post,
  PostResult,
} from "./posting/post.types";
import { postToPlatform } from "./post-to-platform";
import { Unkey } from "@unkey/api";

import { Database } from "@post-for-me/db";
import { processPostMedium } from "process-post-medium";
import { ffmpegProcessVideo } from "ffmpeg-process-video";

const supabaseClient = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const unkey = new Unkey({ rootKey: process.env.UNKEY_ROOT_KEY! });

export const processPost = task({
  id: "process-post",
  maxDuration: 3600,
  retry: { maxAttempts: 1 },
  run: async (payload: {
    index: number;
    post: Post;
  }): Promise<PostResult[]> => {
    const { post } = payload;
    logger.info("Starting post processing", { post });

    logger.info("Getting post accounts");
    const accounts = post.social_post_provider_connections?.map(
      ({ social_provider_connections: connection }) => ({
        ...connection,
      })
    );

    const results: PostResult[] = [];

    try {
      if (!accounts || accounts.length === 0) {
        logger.error("No accounts found for post", { post });
        return [];
      }

      logger.info("Checking API Key is valid");
      const { result, error } = await unkey.keys.get({ keyId: post.api_key });

      if (error || !result.enabled) {
        logger.error("API Key is invalid", { key_result: result });
        results.push(
          ...accounts.map((connection) => ({
            success: false,
            provider_connection_id: connection.id,
            post_id: post.id,
            error_message: `API Key is invalid`,
          }))
        );
        throw new Error("API Key is invalid");
      }

      logger.info("Getting Stripe Customer Id");
      const { data: project, error: projectError } = await supabaseClient
        .from("projects")
        .select(
          `
        *, 
        teams(
         stripe_customer_id
        ),
        social_provider_app_credentials( 
         provider,
         app_id,
         app_secret
        )
        `
        )
        .eq("id", post.project_id)
        .single();

      if (projectError || !project?.teams?.stripe_customer_id) {
        logger.error("Project not found", { projectError, project });
        results.push(
          ...accounts.map((connection) => ({
            success: false,
            provider_connection_id: connection.id,
            post_id: post.id,
            error_message: `No project found`,
          }))
        );
        throw new Error("No project found");
      }

      const postMedia: {
        provider?: string | null;
        provider_connection_id?: string | null;
        url: string;
        thumbnail_url: string;
        thumbnail_timestamp_ms?: number | null;
        type: string;
      }[] = [];
      if (post.social_post_media && post.social_post_media.length > 0) {
        logger.info("Localizing Media", { media: post.social_post_media });

        const localizedMedia = await processPostMedium.batchTriggerAndWait(
          post.social_post_media.map((medium) => ({
            payload: {
              medium: {
                provider: medium.provider,
                provider_connection_id: medium.provider_connection_id,
                url: medium.url,
                thumbnail_url: medium.thumbnail_url,
                thumbnail_timestamp_ms: medium.thumbnail_timestamp_ms,
              },
            },
          }))
        );

        logger.info("Localizing Media Complete", { localizedMedia });

        postMedia.push(
          ...localizedMedia.runs
            .filter((run) => run.ok)
            .map((run) => run.output)
        );

        const postVideos = postMedia.filter(
          (medium) => medium.type === "video"
        );

        if (postVideos.length > 0) {
          logger.info("Processing Videos");
          const processVideosResult =
            await ffmpegProcessVideo.batchTriggerAndWait(
              postVideos.map((video) => ({
                payload: {
                  medium: video,
                },
              }))
            );

          logger.info("Processing Videos Complete", { processVideosResult });
        }

        if (postMedia.length == 0) {
          logger.error("All Media Failed");
          results.push(
            ...accounts.map((connection) => ({
              success: false,
              provider_connection_id: connection.id,
              post_id: post.id,
              error_message: `All media failed to process, please check media URLS`,
            }))
          );
          throw new Error("All media failed to process");
        }
      }

      logger.info("Constructing Post Data");

      const postData = {
        id: post.id,
        stripe_customer_id: project.teams.stripe_customer_id,
        caption: post.caption,
        configurations: post.social_post_configurations,
        media: postMedia,
        api_key: post.api_key,
        accounts: accounts,
      };

      logger.info("Constructed Post Data", { postData });

      const bulkPostData: IndividualPostData[] = [];
      for (const account of postData.accounts) {
        try {
          logger.info("Getting App Credentials");
          const appCredentials =
            account.provider === "bluesky"
              ? ({
                  app_id: "blue_sky_app_id",
                  app_secret: "blue_sky_app_secret",
                } as PlatformAppCredentials)
              : (project.social_provider_app_credentials.find(
                  (credential) => credential.provider === account.provider
                ) as PlatformAppCredentials);

          if (!appCredentials) {
            logger.error("No App credentials found for provider", {
              provider: account.provider,
            });
            results.push({
              success: false,
              provider_connection_id: account.id,
              post_id: post.id,
              error_message: `No App credentials found for provider ${account.provider}`,
            });
            continue;
          }

          logger.info("Got App Credentials");

          logger.info("Creating Individual Post Configuration");
          const platformConfig = postData.configurations.filter(
            (config) => config.provider == account.provider
          )?.[0];
          const accountConfig = postData.configurations.filter(
            (config) => config.provider_connection_id == account.id
          )?.[0];
          const platformMedia = postData.media.filter(
            (medium) => medium.provider == account.provider
          );
          const accountMedia = postData.media.filter(
            (medium) => medium.provider_connection_id == account.id
          );
          const defaultMedia = postData.media.filter(
            (medium) => !medium.provider && !medium.provider_connection_id
          );

          logger.info("Procesing Configuration Data", {
            platformConfig,
            accountConfig,
            platformMedia,
            accountMedia,
            defaultMedia,
          });

          const caption =
            accountConfig?.caption ||
            platformConfig?.caption ||
            postData.caption;
          const media =
            accountMedia && accountMedia.length > 0
              ? accountMedia
              : platformConfig && platformMedia.length > 0
                ? platformMedia
                : defaultMedia;

          const platformData = {
            ...platformConfig?.provider_data,
            ...accountConfig?.provider_data,
          } as PlatformConfiguration;

          bulkPostData.push({
            stripeCustomerId: postData.stripe_customer_id,
            platform: account.provider,
            postId: postData.id,
            account,
            media,
            caption,
            platformConfig: platformData,
            appCredentials,
          });

          logger.info("Created Indidividual Post Configuration");
        } catch (error: any) {
          logger.error("Failed Posting To Account", {
            account,
            postData,
            error,
          });

          results.push({
            success: false,
            error_message: error?.message || "Unkown error",
            provider_connection_id: account.id,
            post_id: postData.id,
            details: { error },
          });
        }
      }

      logger.info("Posting To Accounts", { bulkPostData });
      const batchPostResult = await postToPlatform.batchTriggerAndWait(
        bulkPostData.map((data) => ({ payload: data }))
      );

      logger.info("Posting To Accounts Complete", { batchPostResult });

      results.push(
        ...batchPostResult.runs.filter((run) => run.ok).map((run) => run.output)
      );

      logger.info("Checking Post Results");
      const accountsWithResults = results.map(
        (result) => result.provider_connection_id
      );

      const missingAccounts = postData.accounts.filter(
        (account) => !accountsWithResults.includes(account.id)
      );

      if (missingAccounts && missingAccounts.length > 0) {
        logger.info("Found Missing Post Results", { missingAccounts });

        logger.info("Adding Failed Post Results For Missing Accounts");
        results.push(
          ...missingAccounts.map((account) => ({
            provider_connection_id: account.id,
            error_message:
              "Post Status Unavailable, Please check the social account.",
            success: false,
            post_id: postData.id,
          }))
        );
      }
    } catch (error) {
      logger.error("Unexpected Error", { error });
    } finally {
      logger.info("Saving Post Results", { results });
      const { error: insertResultsError } = await supabaseClient
        .from("social_post_results")
        .insert(results);

      if (insertResultsError) {
        logger.error("Failed to insert post results", { insertResultsError });
      }

      logger.info("Updating Post Status");
      const { error: updatePostError } = await supabaseClient
        .from("social_posts")
        .update({
          status: "processed",
        })
        .eq("id", post.id);

      if (updatePostError) {
        logger.error("Failed to update post status", { updatePostError });
      }

      return results;
    }
  },
});
