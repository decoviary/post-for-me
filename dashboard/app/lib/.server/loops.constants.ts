export const LOOPS_API_KEY = process.env?.LOOPS_API_KEY || "";
export const LOOPS_INVITE_TRANSACTION_ID =
  process.env?.LOOPS_INVITE_TRANSACTION_ID || "";

if (!LOOPS_API_KEY || LOOPS_API_KEY.trim() === "") {
  console.warn("LOOPS_API_KEY is not defined");
}

if (!LOOPS_INVITE_TRANSACTION_ID || LOOPS_INVITE_TRANSACTION_ID.trim() === "") {
  console.warn("LOOPS_INVITE_TRANSACTION_ID is not defined");
}
