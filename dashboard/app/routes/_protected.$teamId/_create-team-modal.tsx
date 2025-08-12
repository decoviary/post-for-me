import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import * as z from "zod";

import { Button } from "~/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/ui/form";
import { Input } from "~/ui/input";

import { useForm as useFormFetcher } from "~/hooks/use-form";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Team name is required").max(50),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTeamModal({ open, onOpenChange }: CreateTeamModalProps) {
  const { errors, isSubmitting, fetcher, data } = useFormFetcher();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (!isSubmitting && data?.success) {
      toast.success("Team created successfully");
      onOpenChange(false);
      form.reset();

      // Navigate to the team edit page
      if (data.teamId) {
        navigate(`/${data.teamId}/edit`);
      }
    } else if (!isSubmitting && data?.errors?.general) {
      toast.error(data.errors.general);
    }
  }, [isSubmitting, data, onOpenChange, form, navigate]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  function handleSubmit(values: FormValues) {
    const formData = new FormData();
    formData.append("name", values.name);
    fetcher.submit(formData, {
      method: "post",
      action: "/api/teams/new",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Team</DialogTitle>
          <DialogDescription>
            Start collaborating with your team.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <fetcher.Form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <p className="empty:hidden italic text-destructive text-sm">
              {errors.general}
            </p>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Engineering" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be visible to team members.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Create Team
              </Button>
            </div>
          </fetcher.Form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
