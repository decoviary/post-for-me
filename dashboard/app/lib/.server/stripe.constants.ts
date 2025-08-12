export const STRIPE_SECRET_KEY = process.env?.STRIPE_SECRET_KEY || "";
export const STRIPE_WEBHOOK_SECRET = process.env?.STRIPE_WEBHOOK_SECRET || "";
export const STRIPE_API_PRODUCT_ID = process.env?.STRIPE_API_PRODUCT_ID || "";
export const STRIPE_CREDS_ADDON_PRODUCT_ID =
  process.env?.STRIPE_CREDS_ADDON_PRODUCT_ID || "";

if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.trim() === "") {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

if (!STRIPE_API_PRODUCT_ID || STRIPE_API_PRODUCT_ID.trim() === "") {
  throw new Error("STRIPE_API_PRODUCT_ID is not defined");
}

// we only need to validate the webhook key in production
const webhookKeyInvalid =
  !STRIPE_WEBHOOK_SECRET || STRIPE_WEBHOOK_SECRET.trim() === "";
if (process.env.mode === "production" && webhookKeyInvalid) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
}
