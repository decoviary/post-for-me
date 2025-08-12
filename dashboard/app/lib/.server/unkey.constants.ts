export const UNKEY_ROOT_KEY = process.env?.UNKEY_ROOT_KEY || "";
export const UNKEY_API_ID = process.env?.UNKEY_API_ID || "";

if (!UNKEY_ROOT_KEY || UNKEY_ROOT_KEY.trim() === "") {
  throw new Error("UNKEY_ROOT_KEY is not defined");
}

if (!UNKEY_API_ID || UNKEY_API_ID.trim() === "") {
  throw new Error("UNKEY_API_ID is not defined");
}
