import type { Route } from "./+types/route";

export type LoaderData = Route.ComponentProps["loaderData"];

export type PostResultPlatformData = {
  id: string;
  url: string;
  username: string;
};

export type PostResult = {
  id: string;
  post_id: string;
  success: boolean;
  error: string | null;
  platform_data: PostResultPlatformData | null;
};

export type Post = {
  id: string;
  caption: string;
  status: "draft" | "processing" | "processed" | "posted" | "error";
  scheduled_at: null;
  platform_configurations: null;
  account_configurations: Array<Record<string, never>>;
  media: null;
  social_accounts: string[];
  created_at: string;
  updated_at: string;
};
