export function PostContentDraft() {
  return (
    <div className="border-2 border-dashed p-8 rounded-md flex items-center justify-center text-center italic text-muted-foreground">
      {
        'This most is marked as a "draft" and will not be posted until it is published.'
      }
    </div>
  );
}
