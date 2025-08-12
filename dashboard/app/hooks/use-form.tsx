import { useEffect } from "react";
import { useFetcher } from "react-router";

import { toast } from "sonner";

interface UseFormProps {
  /** @deprecated */
  withToast?: boolean;
  key?: string;
}

/**
 * note : handling the display of the toast
 * success: { success: true, toast_msg: "Success!" }
 * error: { success: false, toast_msg: "Error!" }
 */
export function useForm(args?: UseFormProps) {
  const fetcher = useFetcher({ key: args?.key });

  const data = fetcher?.data || null;
  const errors = data?.errors || {};
  const isSubmitting = fetcher.state !== "idle";
  const success = fetcher.data?.success;

  useEffect(() => {
    if (!isSubmitting && data?.toast_msg) {
      if (success) {
        toast.success("Success!", {
          description: data?.toast_msg,
          duration: 3000,
        });
      } else {
        toast.error("Error", {
          description: data.toast_msg,
          duration: 3000,
        });
      }
    }
  }, [success, isSubmitting, data?.toast_msg]);

  return {
    fetcher,
    Form: fetcher.Form,
    isSubmitting,
    errors,
    success,
    data,
  };
}
