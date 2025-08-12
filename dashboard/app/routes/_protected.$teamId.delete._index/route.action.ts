import { redirect, data } from "react-router";
import { withSupabase } from "~/lib/.server/supabase";
import { currentUserIsInTeam } from "~/lib/.server/current-user-is-in-team.request";

export const action = withSupabase(async ({ supabase, params, request }) => {
  const { teamId } = params;

  if (!teamId) {
    return data({
      success: false,
      errors: { general: "Missing team code." },
    });
  }

  const formData = await request.formData();
  const confirmation = formData.get("confirmation");

  if (confirmation !== "delete this team") {
    return data({
      success: false,
      errors: { general: "You must type 'delete this team' to confirm." },
    });
  }

  const [isInTeam, currentUser] = await currentUserIsInTeam(
    { teamId },
    supabase
  );

  if (!isInTeam || !currentUser) return redirect("/");

  const { data: team } = await supabase
    .from("teams")
    .select("id, created_by")
    .eq("id", teamId)
    .single();

  if (!team) {
    return data({ success: false, errors: { general: "Team not found." } });
  }

  if (team.created_by !== currentUser.id) {
    return data({
      success: false,
      errors: { general: "Only the team owner can delete the team." },
    });
  }

  const deleteResult = await supabase.from("teams").delete().eq("id", team.id);

  if (deleteResult.error) {
    console.error(deleteResult.error);
    return data({
      success: false,
      errors: { general: "Something went wrong deleting the team." },
    });
  }

  return redirect("/?toast=Team deleted successfully&toast_type=success");
});
