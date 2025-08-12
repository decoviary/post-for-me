import { data, redirect } from "react-router";
import { withSupabase } from "~/lib/.server/supabase";

export const loader = withSupabase(async function ({ supabase, request }) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const token_hash = url.searchParams.get("token_hash");

  if (!type || !token_hash) {
    throw redirect("/sign-in");
  }

  if (type === "reset") {
    const verify = await supabase.auth.verifyOtp({
      type: "email",
      token_hash: token_hash,
    });

    if (verify.error) {
      let errorCode;

      switch (verify.error?.code) {
        case "otp_expired":
          errorCode = "link_expired";
          break;
        default:
          errorCode = "error";
      }

      throw redirect(`/sign-in?error_code=${errorCode}`);
    }

    return data({});
  }

  return redirect("/sign-in");
});
