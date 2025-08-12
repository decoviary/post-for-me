import { data } from "react-router";

import { withSupabase } from "~/lib/.server/supabase";

export const loader = withSupabase(async ({ supabase, params }) => {
  const { teamId } = params;

  if (!teamId) {
    throw new Error("Team code is required");
  }

  const teams = await supabase.from("teams").select("id, name");
  const team = teams?.data?.find((t) => t.id === teamId);

  if (!team) {
    return new Response("Team not found", { status: 404 });
  }

  const [members, auth] = await Promise.all([
    supabase
      .from("team_users")
      .select("user_id, user:users!user_id(id, email, first_name, last_name)")
      .eq("team_id", teamId)
      .order("email", { referencedTable: "users", ascending: true }),
    supabase.auth.getUser(),
  ]);

  const currentUserId = auth.data?.user?.id;

  if (!currentUserId) {
    return new Response("Error", { status: 404 });
  }

  return data({
    team,
    teams: teams.data || [],
    members:
      members.data?.map((member) => ({
        ...member.user,
        full_name: [member.user.first_name, member.user.last_name]
          .filter(Boolean)
          .join(" "),
        isCurrentUser: member.user_id === currentUserId,
      })) || [],
  });
});
