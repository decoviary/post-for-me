import { data } from "react-router";

import { withDashboardKey } from "~/lib/.server/api/api";
import { withSupabase } from "~/lib/.server/supabase";

import type { PostWithConnections } from "./_types";

export interface PostsResponse {
  data: PostWithConnections[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const action = withSupabase(
  withDashboardKey(async ({ params, supabase }) => {
    const { teamId, projectId } = params;

    if (!teamId) {
      throw new Error("Team code is required");
    }

    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const currentUser = await supabase.auth.getUser();

    if (!currentUser.data?.user) {
      throw new Error("User not found");
    }

    try {
      // Todo: Handle different form actions, such as creating, updating, or deleting a post.
      // Example: parse `action` from formData, and perform appropriate Supabase queries.
      // Ensure validation, error handling, and correct /${teamId}/${projectId}/posts context.
      return data({});
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      return data(
        {
          error: "Failed to fetch posts",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  })
);
