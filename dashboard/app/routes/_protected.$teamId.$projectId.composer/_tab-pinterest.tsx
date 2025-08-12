import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "~/ui/form";
import { Input } from "~/ui/input";

export function TabPinterest() {
  return (
    <div className="flex flex-col gap-6">
      {/* Destination Link */}
      <FormField
        name="platform_configurations.pinterest.link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Destination Link</FormLabel>
            <FormControl>
              <Input type="url" placeholder="https://example.com" {...field} />
            </FormControl>
            <FormDescription>
              Where people go when they click your pin. Must be a valid URL.
            </FormDescription>
          </FormItem>
        )}
      />

      {/* Multiple Board IDs  */}
      <FormField
        name="platform_configurations.pinterest.board_ids"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Board IDs</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter additional board IDs (comma separated)"
                value={field.value?.join(", ") ?? ""}
                onChange={(e) => {
                  const ids = e.target.value
                    .split(",")
                    .map((id) => id.trim())
                    .filter(Boolean);
                  field.onChange(ids.length > 0 ? ids : undefined);
                }}
              />
            </FormControl>
            <FormDescription>
              Additional boards to post this pin to. Separate multiple IDs with
              commas.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}
