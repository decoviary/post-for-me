import { useNavigate, useLoaderData } from "react-router";

import { useForm } from "~/hooks/use-form";

import { getProviderLabel } from "~/lib/utils";

import { BrandIcon } from "~/components/brand-icon";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/ui/dialog";
import { Button } from "~/ui/button";
import type { loader } from "./route.loader";

export function Component() {
  const navigate = useNavigate();

  const { isEnabled, provider } = useLoaderData<typeof loader>();

  if (!provider) {
    throw new Error("Provider parameter is required");
  }

  const { Form, isSubmitting } = useForm();

  const handleClose = () => {
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const submitLoading = isSubmitting;
  const submitDisabled = isSubmitting;

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BrandIcon brand={provider.split("_")[0]} className="size-5" />
            Manage {getProviderLabel(provider)}
          </DialogTitle>
          <DialogDescription>
            {isEnabled
              ? `Disabling ${getProviderLabel(provider)} will prevent accounts from being connected/refreshed. Scheduled posts will still be processed`
              : `${getProviderLabel(provider)} is disabled, enable to begin connecting accounts`}
          </DialogDescription>
        </DialogHeader>

        <Form method="post">
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            {isEnabled ? (
              <Button
                type="submit"
                name="action"
                value="disable"
                loading={submitLoading}
                disabled={submitDisabled}
              >
                Disable
              </Button>
            ) : (
              <Button
                type="submit"
                name="action"
                value="enable"
                loading={submitLoading}
                disabled={submitDisabled}
              >
                Enable
              </Button>
            )}
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
