import { RateLimitExceededError } from "loops";

import { loops } from "./loops";
import { LOOPS_INVITE_TRANSACTION_ID } from "./loops.constants";

const MAX_RETRIES = 3;

async function sendInviteEmailWithRetry(email: string, retryCount = 0) {
  if (!loops || !LOOPS_INVITE_TRANSACTION_ID) {
    return;
  }

  try {
    return await loops.sendTransactionalEmail({
      email,
      transactionalId: LOOPS_INVITE_TRANSACTION_ID,
    });
  } catch (error) {
    if (error instanceof RateLimitExceededError && retryCount < MAX_RETRIES) {
      console.warn(
        `Loops rate limit exceeded. Retry attempt ${retryCount + 1} of ${MAX_RETRIES}...`
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return sendInviteEmailWithRetry(email, retryCount + 1);
    }
    throw error;
  }
}

export async function sendInviteEmail(email: string) {
  if (!loops) {
    console.warn("Loops is not initialized");
    return;
  }

  if (!LOOPS_INVITE_TRANSACTION_ID) {
    console.warn("Loops invite transaction ID is not defined");
    return;
  }

  try {
    return await sendInviteEmailWithRetry(email);
  } catch (error) {
    console.error("Failed to send invite email after multiple retries:", error);
    return;
  }
}
