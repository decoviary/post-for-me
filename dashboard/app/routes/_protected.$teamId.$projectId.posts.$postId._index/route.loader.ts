import { data } from "react-router";

import { withDashboardKey } from "~/lib/.server/api/api";
import { withSupabase } from "~/lib/.server/supabase";
import { API_URL } from "~/lib/.server/api/api.constants";

import type { Post, PostResult } from "./types";

export const loader = withSupabase(
  withDashboardKey(async ({ apiKey, params }) => {
    const postId = params.postId;

    // Fetch post data
    const postResponse = await fetch(`${API_URL}/v1/social-posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!postResponse.ok) {
      throw new Response("Post not found", { status: 404 });
    }

    const post: Post = await postResponse.json();

    // If post is completed, fetch results
    let results: PostResult[] = [];
    if (post.status === "posted" || post.status === "processed") {
      const resultsReq = await fetch(
        `${API_URL}/v1/social-post-results?post_id=${postId}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (resultsReq.ok) {
        const resultsRes = await resultsReq.json();

        results = resultsRes?.data || [];
      }
    }

    return data({
      post,
      results,
    });
  })
);
