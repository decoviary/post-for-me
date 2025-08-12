import { useNavigate } from "react-router";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/ui/dialog";

import { VideoUpload } from "./_video-upload";

export function Component() {
  const navigate = useNavigate();
  const { control } = useFormContext();
  const { append } = useFieldArray({ control, name: "media" });

  function goBack() {
    navigate(-1);
  }

  return (
    <Dialog open onOpenChange={goBack}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
        </DialogHeader>
        <VideoUpload
          onUploadComplete={(fileUrl) => {
            append({
              id: crypto.randomUUID(),
              type: "video",
              name: "Uploaded Video",
              url: fileUrl,
              preview: fileUrl,
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
