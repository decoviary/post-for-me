import { data, redirect } from "react-router";

import { withDashboardKey } from "~/lib/.server/api/api";
import { withSupabase } from "~/lib/.server/supabase";

import { API_URL } from "~/lib/.server/api/api.constants";

export const action = withSupabase(
  withDashboardKey(async ({ request, apiKey, params }) => {
    const json = await request.json();

    console.log(json);

    const response = await fetch(`${API_URL}/v1/social-posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    });

    if (!response.ok) {
      console.log(response);

      return data({
        success: false,
        toast_msg: "There was an error posting your content.",
      });
    }

    const postData = await response.json();
    const postId = postData.id;

    // Redirect to the post progress page
    return redirect(`/${params.teamId}/${params.projectId}/posts/${postId}`);
  })
);
