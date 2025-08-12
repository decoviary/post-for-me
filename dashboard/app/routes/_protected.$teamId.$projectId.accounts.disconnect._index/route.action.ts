import { redirect } from "react-router";

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
      return redirect("/");
    }

    const formData = await request.formData();
    const connectionId = formData.get("connectionId") as string | null;

    // Handle missing connection ID
    if (!connectionId) {
      const errorParams = new URLSearchParams({
        toast: "Missing connection ID",
        toast_type: "error",
      });
      return redirect(
        `/${teamId}/${projectId}/accounts?${errorParams.toString()}`
      );
    }

    const apiUrl = `${API_URL}/v1/social-accounts/${connectionId}/disconnect`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      let toastMessage = "Account disconnected successfully";
      let toastType = "success";

      if (!response.ok) {
        toastMessage = "Failed to disconnect the account";
        toastType = "error";
      }

      const query = new URLSearchParams({
        toast: toastMessage,
        toast_type: toastType,
      });

      return redirect(`/${teamId}/${projectId}/accounts?${query.toString()}`);
    } catch (e) {
      console.error("Error disconnecting account:", e);

      const query = new URLSearchParams({
        toast: "Failed to disconnect the account",
        toast_type: "error",
      });

      return redirect(`/${teamId}/${projectId}/accounts?${query.toString()}`);
    }
  })
);
