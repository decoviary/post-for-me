import { data } from "react-router";
import { withDashboardKey } from "~/lib/.server/api/api";
import { withSupabase } from "~/lib/.server/supabase";
import { API_URL } from "~/lib/.server/api/api.constants";
import type { PostWithConnections } from "./_types";

export interface PostsResponse {
  data: PostWithConnections[];
  meta: {
    offset: number;
    limit: number;
    total: number;
    next: string;
  };
}

export const loader = withSupabase(
  withDashboardKey(async ({ request, apiKey, params, supabase }) => {
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

    const url = new URL(request.url);

    // Extract query parameters for pagination and sorting
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const status = url.searchParams.get("status");

    if (!apiKey) {
      return data({
        success: false,
        error:
          "No active subscription for this team. Please upgrade to view posts.",
        posts: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        projectId,
      });
    }

    // Build query parameters
    const queryParams = new URLSearchParams({
      offset: ((page - 1) * limit).toString(),
      limit: limit.toString(),
    });

    // Add optional filters
    if (status) {
      queryParams.append("status", status);
    }

    try {
      // Fetch posts for the project with pagination and sorting
      const postsResponse = await fetch(
        `${API_URL}/v1/social-posts?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!postsResponse.ok) {
        console.error(
          "Error fetching posts:",
          postsResponse.status,
          postsResponse.statusText
        );
        return data({
          success: false,
          error: "Failed to fetch posts",
          posts: [],
          totalCount: 0,
          currentPage: page,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
          projectId,
        });
      }

      const postsData: PostsResponse = await postsResponse.json();

      const totalPages = Math.ceil((postsData.meta?.total || 0) / limit);

      return data({
        success: true,
        posts: postsData.data || [],
        totalCount: postsData.meta?.total || 0,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        projectId,
      });
    } catch (error) {
      console.error("Error fetching posts:", error);

      return data({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        posts: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        projectId,
      });
    }
  })
);
