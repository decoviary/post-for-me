import { data } from "react-router";
import { customerHasActiveSubscriptions } from "~/lib/.server/customer-has-active-subscriptions.request";

import { withSupabase } from "~/lib/.server/supabase";
import { unkey } from "~/lib/.server/unkey";
import { UNKEY_API_ID } from "~/lib/.server/unkey.constants";

export const action = withSupabase(async ({ supabase, params }) => {
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

  const [team, project] = await Promise.all([
    supabase
      .from("teams")
      .select("stripe_customer_id, team_addons(addon, expires_at)")
      .eq("id", teamId)
      .single(),
    supabase.from("projects").select("is_system").eq("id", projectId).single(),
  ]);

  if (!team.data || !project.data) {
    return data({ success: false, error: "Not found", result: null });
  }

  let hasActiveSubscription = false;

  if (project.data.is_system) {
    const systemAddon = team.data.team_addons?.filter(
      (t) => t.addon === "managed_system_credentials"
    )?.[0];

    hasActiveSubscription = !systemAddon
      ? false
      : new Date() < new Date(systemAddon.expires_at);
  } else {
    hasActiveSubscription = await customerHasActiveSubscriptions(
      team.data.stripe_customer_id
    );
  }

  if (!hasActiveSubscription) {
    return data({
      success: false,
      toast_msg: "You must have an active subscription to create an API key",
      result: null,
    });
  }

  const apiKey = await unkey.keys.create({
    apiId: UNKEY_API_ID,
    prefix: "pfm_live",
    name: "API Key",
    externalId: projectId,
    meta: {
      project_id: projectId,
      team_id: teamId,
      created_by: currentUser.data.user.id,
    },
    enabled: true,
    recoverable: false,
    environment: "live",
  });

  if (apiKey.error || !apiKey.result) {
    return data({ success: false, error: apiKey.error, result: null });
  }

  return data({
    success: true,
    error: null,
    result: {
      key: apiKey.result.key,
    },
  });
});
