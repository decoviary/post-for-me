import { redirect } from "react-router";
import { withSupabase } from "~/lib/.server/supabase";

export const loader = withSupabase(async ({ supabase }) => {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    throw redirect("/logout");
  }

  return null;
});
