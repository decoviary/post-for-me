import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/ui/dialog";
import { Input } from "~/ui/input";
import { useForm } from "~/hooks/use-form";

import { cn } from "~/lib/utils";

export function Component() {
  const navigate = useNavigate();
  const { Form, success, errors } = useForm();
  const [confirmationText, setConfirmationText] = useState("");

  function goBack() {
    navigate(-1);
  }

  const isConfirmed =
    confirmationText.trim().toLowerCase() === "delete this team";

  return (
    <Dialog open onOpenChange={goBack}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this team?</DialogTitle>
          <DialogDescription>
            This action is irreversible. To confirm, type{" "}
            <strong>delete this team</strong>.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div>
            <p className="text-sm italic text-affirmative">
              Team deleted successfully.
            </p>
            <DialogFooter>
              <Button onClick={() => navigate("/")}>Go to dashboard</Button>
            </DialogFooter>
          </div>
        ) : (
          <Form method="post" className="grid gap-6">
            <p className="text-sm text-destructive italic empty:hidden">
              {errors.general}
            </p>

            <Input
              type="text"
              id="confirmation"
              name="confirmation"
              placeholder="delete this team"
              autoComplete="off"
              required
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={goBack}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={!isConfirmed}
                className={cn(
                  isConfirmed
                    ? "hover:bg-destructive/90 cursor-pointer"
                    : "cursor-not-allowed opacity-50 "
                )}
              >
                Delete Team
              </Button>
            </DialogFooter>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
