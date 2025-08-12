import { data, redirect } from "react-router";

import { withSupabase } from "~/lib/.server/supabase";

import { currentUserIsInTeam } from "~/lib/.server/current-user-is-in-team.request";

export const action = withSupabase(async ({ supabase, params, request }) => {
  const { teamId, projectId } = params;

  if (!teamId || !projectId) {
    throw new Error("Team and project IDs are required");
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

  const projectData: { name?: string } = {};

  if (name && name?.length > 0) {
    projectData.name = name;
  }

  if (Object.keys(projectData).length > 0) {
    const projectUpdate = await supabase
      .from("projects")
      .update(projectData)
      .eq("id", projectId)
      .eq("team_id", teamId)
      .select("id, name")
      .single();

    return data({
      success: true,
      updated: projectUpdate.data,
    });
  }

  return data({
    success: true,
    updated: {},
  });
});
