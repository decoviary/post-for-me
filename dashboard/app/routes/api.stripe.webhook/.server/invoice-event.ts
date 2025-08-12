import type { SupabaseClient } from "@supabase/supabase-js";
import type { Stripe } from "stripe";
import type { Database } from "@post-for-me/db";
import { STRIPE_CREDS_ADDON_PRODUCT_ID } from "~/lib/.server/stripe.constants";
import { updateAPIKeyAccess } from "~/lib/.server/update-api-key-access.request";
import { customerHasActiveSubscriptions } from "~/lib/.server/customer-has-active-subscriptions.request";

export async function handleInvoiceEvent(
  invoice: Stripe.Invoice,
  supabaseServiceRole: SupabaseClient<Database>
) {
  const customerId = invoice.customer as string;
  const systemCredsLineItem = invoice.lines.data.find(
    (l) => l.pricing?.price_details?.product == STRIPE_CREDS_ADDON_PRODUCT_ID
  );

  if (systemCredsLineItem) {
    const team = await supabaseServiceRole
      .from("teams")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .single();

    if (team.error || !team.data) {
      console.error("team not found", { team });
      return;
    }

    const expiresAt = new Date(systemCredsLineItem.period.end * 1000);
    expiresAt.setDate(expiresAt.getDate() + 1);

    const { error } = await supabaseServiceRole.from("team_addons").upsert(
      {
        team_id: team.data.id,
        addon: "managed_system_credentials",
        expires_at: expiresAt.toISOString(),
      },
      { onConflict: "team_id, addon" }
    );

    if (error) {
      console.error(error);
    }
  }

  const isSubscriptionActive = await customerHasActiveSubscriptions(customerId);

  await updateAPIKeyAccess(
    {
      stripeCustomerId: customerId,
      enabled: isSubscriptionActive,
    },
    supabaseServiceRole
  );
}
