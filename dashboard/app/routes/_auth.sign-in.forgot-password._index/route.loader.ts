import { redirect, data } from "react-router";

import { withSupabase } from "~/lib/.server/supabase";

export const loader = withSupabase(async function ({ supabase }) {
  const session = await supabase.auth.getUser();

  if (session.data.user) {
    return redirect("/");
  }

  return data({});
});
