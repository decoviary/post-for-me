import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog";

import { AccountForm } from "./account-form";

interface AccountDialogProps {
  children: React.ReactNode;
}

export function AccountDialog({ children }: AccountDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Post for Me!</DialogTitle>
          <DialogDescription>
            {`Let's finish setting up your account`}
          </DialogDescription>
        </DialogHeader>

        <AccountForm />
      </DialogContent>
    </Dialog>
  );
}
