import { redirect } from "react-router";

import { withSupabase } from "~/lib/.server/supabase";

export const loader = withSupabase(async ({ supabase }) => {
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw redirect("/logout");
  }

  // Fetch user's first team
  const { data: teamUser, error: teamError } = await supabase
    .from("team_users")
    .select("team_id")
    .eq("user_id", userData.user.id)
    .limit(1)
    .maybeSingle();

  if (teamError || !teamUser?.team_id) {
    console.error("Failed to fetch team:", teamError);
    throw new Error("Failed to fetch team");
  }

  const teamId = teamUser.team_id;

  // Fetch first project from that team
  const { data: projects, error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("team_id", teamId)
    .order("created_at", { ascending: true })
    .limit(1);

  if (projectError) {
    console.error("Failed to fetch projects:", projectError);
    return redirect(`/${teamId}`);
  }

  // Redirect to project or team route
  if (projects && projects.length > 0) {
    return redirect(`/${teamId}/${projects[0].id}`);
  } else {
    return redirect(`/${teamId}`);
  }
});
