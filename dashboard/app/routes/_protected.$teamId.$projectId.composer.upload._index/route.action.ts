import { data } from "react-router";

import { withDashboardKey } from "~/lib/.server/api/api";
import { withSupabase } from "~/lib/.server/supabase";

import { currentUserIsInTeam } from "~/lib/.server/current-user-is-in-team.request";

import { API_URL } from "~/lib/.server/api/api.constants";

export const action = withSupabase(
  withDashboardKey(async ({ request, apiKey, params, supabase }) => {
    const { teamId, projectId } = params;

    if (!teamId || !projectId) {
      throw new Error("Team ID and Project ID are required");
    }

    if (!apiKey) {
      throw new Error("No API Key");
    }

    const [isInTeam, currentUser] = await currentUserIsInTeam(
      { teamId },
      supabase
    );

    if (!isInTeam || !currentUser) {
      throw new Response("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const filename = formData.get("filename") as string | null;
    const contentType = formData.get("contentType") as string | null;
    const size = formData.get("size") as string | null;

    if (!filename || !contentType || !size) {
      return data(
        {
          error: "Missing required fields: filename, contentType, or size",
        },
        { status: 400 }
      );
    }

    const apiUrl = `${API_URL}/v1/media/create-upload-url`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: filename,
        mime_type: contentType,
        size_bytes: Number(size),
      }),
    });

    const uploadResponse = await response.json();
    if (!response.ok) {
      return data(
        {
          error: uploadResponse?.error || "Failed to create upload URL",
        },
        { status: response.status }
      );
    }

    return data(uploadResponse); // contains { upload_url, media_url }
  })
);
