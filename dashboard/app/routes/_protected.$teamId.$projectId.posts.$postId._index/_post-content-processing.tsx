export function PostContentProcessing() {
  return (
    <div className="border-2 border-dashed p-8 rounded-md flex items-center justify-center text-center italic text-muted-foreground">
      <div className="max-w-lg">
        <p>{"The post is being processed for publishing."}</p>
        <p>
          {
            "When it is complete, the results of each account that was posted to will be displayed here."
          }
        </p>
      </div>
    </div>
  );
}
