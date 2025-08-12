import { data } from "react-router";

import { withSupabase } from "~/lib/.server/supabase";

export const loader = withSupabase(async ({ supabase }) => {
  const currentUser = await supabase.auth.getUser();

  if (!currentUser.data?.user) {
    throw new Error("User not found");
  }

  const { user } = currentUser.data;

  return data({
    user: {
      email: user.email,
      firstName: user.user_metadata?.first_name || "",
      lastName: user.user_metadata?.last_name || "",
    },
  });
});
