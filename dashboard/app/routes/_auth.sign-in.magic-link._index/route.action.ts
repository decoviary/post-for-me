import { withSupabase } from "~/lib/.server/supabase";

export const action = withSupabase(async ({ supabase, request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  if (!email) {
    throw new Error("Email is required");
  }

  const { origin } = new URL(request.url);

  const signIn = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/sign-in/confirm`,
    },
  });

  if (signIn.error) {
    return {
      success: false,
      error: signIn.error,
    };
  }

  return {
    success: true,
  };
});
