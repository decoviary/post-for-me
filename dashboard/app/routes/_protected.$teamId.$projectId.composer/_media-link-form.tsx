import { useForm } from "react-hook-form";

import { Button } from "~/ui/button";
import { Input } from "~/ui/input";
import { Label } from "~/ui/label";

import type { MediaLinkFormProps } from "./types";

export function MediaLinkForm({ onCancel, onSubmit }: MediaLinkFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      url: "",
    },
  });

  const url = watch("url");

  const onSubmitForm = async (data: { url: string }) => {
    if (data.url.trim()) {
      try {
        await onSubmit(data.url.trim());
        reset();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div
      className="space-y-3"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSubmit(onSubmitForm)();
        }
      }}
    >
      <div>
        <Label htmlFor="media-url" className="text-xs">
          Media URL
        </Label>
        <Input
          id="media-url"
          type="url"
          placeholder="https://example.com/video.mp4"
          {...register("url")}
          className="mt-1"
          autoFocus
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={!url?.trim() || isSubmitting}
          onClick={() => handleSubmit(onSubmitForm)()}
        >
          {isSubmitting ? "Adding..." : "Add Link"}
        </Button>
      </div>
    </div>
  );
}
