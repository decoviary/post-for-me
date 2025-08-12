import { data, redirect } from "react-router";

import { withSupabase } from "~/lib/.server/supabase";

import { currentUserIsInTeam } from "~/lib/.server/current-user-is-in-team.request";

export const action = withSupabase(async ({ supabase, params, request }) => {
  const { teamId } = params;
  const formData = await request.formData();
  const userIdToDelete = formData.get("userId") as string;

  if (!teamId) {
    throw new Error("Team code is required");
  }

  if (!userIdToDelete) {
    return data({
      success: false,
      errors: {
        general: "There was an error removing the user from the team",
        userId: "User ID is required",
      },
    });
  }

  const [isInTeam, currentUser] = await currentUserIsInTeam(
    { teamId },
    supabase
  );

  if (!isInTeam || !currentUser) {
    return redirect("/");
  }

  const teamUser = await supabase
    .from("team_users")
    .select("team_id, user:users!user_id(id, email)")
    .eq("team_id", teamId)
    .eq("user_id", userIdToDelete)
    .single();

  if (!teamUser.data) {
    throw new Error("Not found");
  }

  const deleteReq = await supabase
    .from("team_users")
    .delete()
    .eq("team_id", teamUser.data.team_id)
    .eq("user_id", userIdToDelete);

  if (deleteReq.error) {
    return data({
      success: true,
      errors: {
        general: "There was an error removing the user from the team",
      },
    });
  }

  if (userIdToDelete === currentUser.id) {
    return redirect(
      "/?toast=You have been removed from the team&toast_type=success"
    );
  }

  return redirect(
    `../?toast=${teamUser.data.user.email} was removed from the team&toast_type=success`
  );
});
