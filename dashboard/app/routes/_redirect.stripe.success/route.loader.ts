import { withSupabase } from "~/lib/.server/supabase";
import { stripe } from "~/lib/.server/stripe";
import { redirect } from "react-router";

export const loader = withSupabase(async ({ request, supabaseServiceRole }) => {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return new Response("Unknown", { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.status !== "complete" || !session.client_reference_id) {
    throw redirect(
      `/?toast=Your payment was not successful. Please try again.&toast_type=error`
    );
  }

  const updatedTeam = await supabaseServiceRole
    .from("teams")
    .update({
      stripe_customer_id: session.customer as string,
    })
    .eq("id", session.client_reference_id)
    .select()
    .single();

  if (updatedTeam.error) {
    throw redirect(
      `/?toast=Your payment was successful but we could not update your team. Please reach out to support.&toast_type=error`
    );
  }

  return redirect(
    `/${updatedTeam.data.id}/billing?toast=Your payment was successful.&toast_type=success`
  );
});
