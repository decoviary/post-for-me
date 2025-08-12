import { useNavigate, Link } from "react-router";

import { BrandIcon } from "~/components/brand-icon";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/ui/dialog";

export function Component() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(`..`);
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BrandIcon brand="tiktok" className="size-5" />
            Setup TikTok Business
          </DialogTitle>
          <DialogDescription>
            {`Full integration coming soon. If interested in early accesss contact us at: `}
            <Link
              to={`mailto:postforme@daymoon.dev`}
              target="_blank"
              className="underline underline-offset-2 text-accent-foreground hover:cursor-pointer"
            >
              postforme@daymoon.dev
            </Link>
            .
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
