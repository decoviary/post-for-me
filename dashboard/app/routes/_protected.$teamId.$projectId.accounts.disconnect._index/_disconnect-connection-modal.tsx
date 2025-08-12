import { useLocation, useNavigate, useParams } from "react-router";
import { useForm as useFormFetcher } from "~/hooks/use-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/ui/dialog";
import { Button } from "~/ui/button";

interface LocationState {
  connection?: {
    id: string;
    provider?: string;
    social_provider_user_name?: string;
  };
}

export function DisconnectConnectionModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const { teamId, projectId } = useParams();
  const { fetcher, isSubmitting } = useFormFetcher();

  const state = location.state as LocationState | null;
  const connectionId = state?.connection?.id;
  const provider = state?.connection?.provider;
  const username = state?.connection?.social_provider_user_name;

  const open = !!connectionId;

  const handleClose = () => {
    navigate(".", { replace: true });
    navigate(`/${teamId}/${projectId}/accounts`, { replace: true });
  };

  const handleConfirm = () => {
    if (!connectionId) return;

    const formData = new FormData();
    formData.append("connectionId", connectionId);

    fetcher.submit(formData, {
      method: "POST",
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Disconnect Social Media Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to disconnect the{" "}
            <span className="font-semibold">
              {provider || "social"} account
            </span>{" "}
            {username ? `(@${username})` : ""}?<br />
            You can reconnect it later by authenticating again.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Disconnecting..." : "Disconnect"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
