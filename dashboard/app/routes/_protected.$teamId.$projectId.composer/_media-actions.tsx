import { useState } from "react";
import { Link } from "react-router";
import { LinkIcon, UploadIcon } from "lucide-react";
import { Button } from "~/ui/button";
import { MediaLinkForm } from "./_media-link-form";

import type { MediaActionsProps } from "./types";

export function MediaActions({ onAddMedia }: MediaActionsProps) {
  const [showLinkForm, setShowLinkForm] = useState(false);

  if (showLinkForm) {
    return (
      <MediaLinkForm
        onCancel={() => setShowLinkForm(false)}
        onSubmit={(url) => {
          onAddMedia(url);
          setShowLinkForm(false);
        }}
      />
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setShowLinkForm(true)}
        className="flex items-center gap-2"
      >
        <LinkIcon className="size-4" />
        Media Link
      </Button>

      <Button
        asChild
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Link to="upload">
          <UploadIcon className="size-4" />
          Upload Media
        </Link>
      </Button>
    </div>
  );
}
