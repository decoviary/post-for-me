import { redirect, data } from "react-router";

import { withSupabase } from "~/lib/.server/supabase";
import { currentUserIsInTeam } from "~/lib/.server/current-user-is-in-team.request";

import { CONFIRMATION_KEY } from "./route.constants";

export const action = withSupabase(async ({ supabase, params, request }) => {
  const { teamId, projectId } = params;

  if (!teamId || !projectId) {
    return data({
      success: false,
      errors: { general: "Missing team code or project code." },
    });
  }

  const formData = await request.formData();
  const confirmation = formData.get("confirmation");

  if (confirmation !== CONFIRMATION_KEY) {
    return data({
      success: false,
      errors: { general: `You must type '${CONFIRMATION_KEY}' to confirm.` },
    });
  }

  const [isInTeam, currentUser] = await currentUserIsInTeam(
    { teamId: teamId },
    supabase
  );

  if (!isInTeam || !currentUser) return redirect("/");

  const { data: project } = await supabase
    .from("projects")
    .select("id, team_id, created_by")
    .eq("id", projectId)
    .eq("team_id", teamId)
    .single();

  if (!project) {
    return data({ success: false, errors: { general: "Project not found." } });
  }

  if (project.created_by !== currentUser.id) {
    return data({
      success: false,
      errors: { general: "Only the project owner can delete the project." },
    });
  }

  const deleteResult = await supabase
    .from("projects")
    .delete()
    .eq("id", project.id);

  if (deleteResult.error) {
    console.error(deleteResult.error);
    return data({
      success: false,
      errors: { general: "Something went wrong deleting the project." },
    });
  }

  return redirect(
    `/${teamId}?toast=Project deleted successfully&toast_type=success`
  );
});
