import { redirect } from "react-router";
import { withSupabase } from "~/lib/.server/supabase";

export const action = withSupabase(async ({ supabase, request }) => {
  const formData = await request.formData();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Basic validations
  if (!password || !confirmPassword || password !== confirmPassword) {
    throw redirect("/sign-in/new-password?error_code=invalid_password");
  }

  try {
    const session = await supabase.auth.getUser();

    const user = session.data.user;

    if (!user) {
      return redirect("/sign-in");
    }

    // Update the password
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.log(error);
      throw redirect("/sign-in/new-password?error_code=update_failed");
    }

    return redirect("/");
  } catch (error) {
    console.error(error);
    if (error instanceof Response) {
      throw error;
    }

    throw redirect("/sign-in/new-password?error_code=network_error");
  }
});
