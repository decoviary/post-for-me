import { data } from "react-router";

import { withSupabase } from "~/lib/.server/supabase";
import { unkey } from "~/lib/.server/unkey";
import { UNKEY_API_ID } from "~/lib/.server/unkey.constants";

export const loader = withSupabase(async ({ supabase, params }) => {
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

  const apiKeys = await unkey.apis.listKeys({
    apiId: UNKEY_API_ID,
    externalId: projectId,
    limit: 100,
    revalidateKeysCache: true,
  });

  if (apiKeys.error || !apiKeys.result) {
    return data({ success: false, error: apiKeys.error, keys: [] });
  }

  return data({
    success: true,
    keys:
      apiKeys?.result?.keys
        ?.filter((key) => !key.start.includes("pfm_tmp"))
        ?.map((key) => ({
          id: key.id,
          name: key.name,
          start: key.start,
          createdAt: key.createdAt,
          enabled: key.enabled || false,
        }))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ) || [],
  });
});
