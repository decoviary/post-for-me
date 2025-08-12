import { FormField, FormItem, FormLabel, FormControl } from "~/ui/form";
import { Input } from "~/ui/input";

export function TabYouTube() {
  return (
    <div className="flex flex-col gap-6">
      <FormField
        name="platform_configurations.youtube.title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter YouTube video title" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
