import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/ui/dialog";
import { Input } from "~/ui/input";
import { useForm as useFormFetcher } from "~/hooks/use-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/ui/form";

import { toast } from "sonner";
import { cn } from "~/lib/utils";

import { CONFIRMATION_KEY } from "./route.constants";

const formSchema = z.object({
  confirmation: z.string().min(1, "Confirmation text is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function Component() {
  const navigate = useNavigate();
  const { errors, isSubmitting, fetcher, data } = useFormFetcher();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirmation: "",
    },
  });

  function goBack() {
    navigate(-1);
  }

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("confirmation", values.confirmation);
    fetcher.submit(formData, {
      method: "post",
    });
  }

  useEffect(() => {
    if (!isSubmitting && data?.success) {
      toast.success("Project deleted successfully");
      navigate("/");
    }
  }, [isSubmitting, data, navigate]);

  const isConfirmed =
    form.watch("confirmation").trim().toLowerCase() === CONFIRMATION_KEY;

  return (
    <Dialog open onOpenChange={goBack}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this project?</DialogTitle>
          <DialogDescription>
            This will delete all API keys and data. This action is irreversible.
          </DialogDescription>

          <DialogDescription>
            To confirm, type <strong>delete this project</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <fetcher.Form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-6"
          >
            <p className="text-sm text-destructive italic empty:hidden">
              {errors.general}
            </p>

            <FormField
              control={form.control}
              name="confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={CONFIRMATION_KEY}
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={goBack}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={!isConfirmed || isSubmitting}
                className={cn(
                  isConfirmed
                    ? "hover:bg-destructive/90 cursor-pointer"
                    : "cursor-not-allowed opacity-50 "
                )}
              >
                Delete Project
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
