import { data, redirect } from "react-router";

import { withSupabase } from "~/lib/.server/supabase";

import { currentUserIsInTeam } from "~/lib/.server/current-user-is-in-team.request";

export const action = withSupabase(async ({ supabase, params, request }) => {
  const { teamId } = params;

  if (!teamId) {
    throw new Error("Team code is required");
  }

  const [isInTeam, currentUser] = await currentUserIsInTeam(
    { teamId },
    supabase
  );

  if (!isInTeam || !currentUser) {
    return redirect("/");
  }

  const formData = await request.formData();
  const name = formData.get("name") as string;
  const billingEmail = formData.get("billingEmail") as string;

  const teamData: { name?: string; billing_email?: string } = {};

  if (name && name?.length > 0) {
    teamData.name = name;
  }

  if (billingEmail?.length > 0) {
    teamData.billing_email = billingEmail;
  }

  if (Object.keys(teamData).length > 0) {
    const teamUpdate = await supabase
      .from("teams")
      .update(teamData)
      .eq("id", teamId)
      .select("id, name")
      .single();

    return data({
      success: true,
      updated: teamUpdate.data,
    });
  }

  return data({
    success: true,
    updated: {},
  });
});
