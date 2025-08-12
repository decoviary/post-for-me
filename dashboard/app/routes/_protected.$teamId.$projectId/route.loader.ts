import { data } from "react-router";

import { withSupabase } from "~/lib/.server/supabase";

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

  const project = await supabase
    .from("projects")
    .select("id, name, team_id, is_system")
    .eq("team_id", teamId)
    .eq("id", projectId)
    .single();

  if (!project.data) {
    return new Response("Project not found", { status: 404 });
  }

  return data({ project: project.data });
});
