import { redirect } from "react-router";

import { withSupabase } from "~/lib/.server/supabase";

export const action = withSupabase(async function ({ supabase }) {
  await supabase.auth.signOut();

  return redirect("/sign-in");
});
