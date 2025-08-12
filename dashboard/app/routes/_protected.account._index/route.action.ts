import { data } from "react-router";

import { withSupabase } from "~/lib/.server/supabase";

export const action = withSupabase(async ({ supabase, request }) => {
  const currentUser = await supabase.auth.getUser();
  if (!currentUser.data?.user) {
    throw new Error("User not found");
  }

  const formData = await request.formData();

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  if (!firstName || !lastName) {
    return data(
      { success: false, error: "First name and last name are required" },
      { status: 400 }
    );
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      first_name: firstName,
      last_name: lastName,
    },
  });

  if (error) {
    return data({ error: error.message }, { status: 400 });
  }

  return data({
    success: true,
    toast_msg: "Profile updated successfully",
    user: {
      email: currentUser.data.user.email,
      firstName,
      lastName,
    },
  });
});
