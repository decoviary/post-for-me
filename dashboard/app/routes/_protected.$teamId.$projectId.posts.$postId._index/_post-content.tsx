import { useLoaderData } from "react-router";

import { PostContentDraft } from "./_post-content-draft";
import { PostContentProcessing } from "./_post-content-processing";

import type { LoaderData } from "./types";
import { PostContentProcessed } from "./_post-content-processed";

export function PostContent() {
  const { post } = useLoaderData<LoaderData>();

  if (post.status === "draft") {
    return <PostContentDraft />;
  }

  if (post.status === "processing") {
    return <PostContentProcessing />;
  }

  if (post.status === "posted" || post.status === "processed") {
    return <PostContentProcessed />;
  }

  return null;
}
