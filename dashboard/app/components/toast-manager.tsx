import { useEffect } from "react";
import { useSearchParams } from "react-router";

import { toast } from "sonner";

import { Toaster } from "~/ui/sonner";

const TOAST_KEY = "toast";
const TOAST_DESCRIPTION_KEY = "toast_msg";
const TOAST_TYPE_KEY = "toast_type";

export function ToastManager() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const message = searchParams.get(TOAST_KEY);
    if (!message) return;

    const type = searchParams.get(TOAST_TYPE_KEY) || "default";
    const description = searchParams.get(TOAST_DESCRIPTION_KEY) || undefined;

    // Show toast based on type
    switch (type) {
      case "success":
        toast.success(message, { description });
        break;
      case "error":
        toast.error(message, { description });
        break;
      case "info":
        toast.info(message, { description });
        break;
      case "warning":
        toast.warning(message, { description });
        break;
      default:
        toast(message, { description });
    }

    // Remove toast-related params to prevent duplicate toasts
    searchParams.delete(TOAST_KEY);
    searchParams.delete(TOAST_TYPE_KEY);
    searchParams.delete(TOAST_DESCRIPTION_KEY);
    setSearchParams(searchParams);

    // Or replace URL without query
    // navigate(location.pathname, { replace: true });
  }, [searchParams, setSearchParams]);

  return <Toaster richColors />;
}
