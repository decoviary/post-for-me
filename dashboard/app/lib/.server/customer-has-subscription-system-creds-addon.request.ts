import { stripe } from "./stripe";

export async function customerHasSubscriptionSystemCredsAddon(
  stripeCustomerId: string | null | undefined
) {
  let hasActiveSubscription = false;

  if (stripeCustomerId) {
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
    });
    hasActiveSubscription = subscriptions.data.some(
      (sub) =>
        sub.status === "active" &&
        sub.items?.data?.some(
          (item) =>
            item.price?.metadata?.allows_system_credentials_access === "true"
        )
    );
  }

  return hasActiveSubscription;
}
