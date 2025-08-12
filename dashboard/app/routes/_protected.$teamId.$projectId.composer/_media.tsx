import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { MediaActions } from "./_media-actions";
import { MediaList } from "./_media-list";

export function Media() {
  const { control } = useFormContext();
  const { append, remove } = useFieldArray({
    control,
    name: "media",
  });

  const mediaItems = useWatch({
    control,
    name: "media",
  });

  const handleAddMedia = (url: string) => {
    const newMedia = {
      id: crypto.randomUUID(),
      type: "link" as const,
      url,
      name: url.split("/").pop() || "Media Link",
      preview: undefined,
    };

    append(newMedia);
  };

  const handleRemoveMedia = (index: number) => {
    remove(index);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-3">Media</h3>
        <MediaActions onAddMedia={handleAddMedia} />
      </div>

      {mediaItems && mediaItems.length > 0 ? (
        <MediaList
          items={mediaItems}
          onRemove={(id) => {
            const index = mediaItems.findIndex(
              (item: { id: string }) => item.id === id
            );
            if (index >= 0) {
              handleRemoveMedia(index);
            }
          }}
        />
      ) : null}
    </div>
  );
}
