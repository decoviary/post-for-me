import { stripe } from "./stripe";

export async function customerHasActiveSubscriptions(
  stripeCustomerId: string | null | undefined
) {
  let hasActiveSubscription = false;

  if (stripeCustomerId) {
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
    });
    hasActiveSubscription = subscriptions.data.length > 0;
  }

  return hasActiveSubscription;
}
