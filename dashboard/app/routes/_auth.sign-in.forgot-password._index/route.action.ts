import { redirect } from "react-router";
import { withSupabase } from "~/lib/.server/supabase";

export const action = withSupabase(async ({ supabase, request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    throw redirect("/sign-in/forgot-password?error_code=invalid_email");
  }

  try {
    const { origin } = new URL(request.url);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/sign-in/new-password`,
    });

    if (error) {
      console.error(error);
      throw redirect("/sign-in/forgot-password?error_code=reset_failed");
    }

    return {
      success: true,
      email,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof Response) {
      throw error; // Re-throw redirect responses
    }

    throw redirect("/sign-in/forgot-password?error_code=network_error");
  }
});
