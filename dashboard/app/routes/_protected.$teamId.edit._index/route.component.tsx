import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/ui/button";
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

import type { loader } from "~/routes/_protected.$teamId/route";
import { useRouteLoaderData } from "react-router";

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  billingEmail: z.string().email("Enter a valid email address"),
});

export function Component() {
  const loaderData = useRouteLoaderData<typeof loader>(
    "routes/_protected.$teamId"
  );
  const { errors, isSubmitting, fetcher, data } = useFormFetcher();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: loaderData?.team?.name,
      billingEmail: loaderData?.team?.billing_email || "",
    },
  });

  const title = `Team details`;
  const description = "Edit your details details.";

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("billingEmail", values.billingEmail);

    fetcher.submit(formData, {
      method: "post",
    });
  }

  useEffect(() => {
    if (!isSubmitting && data?.success) {
      toast.success("Changes saved");
    }
  }, [isSubmitting, data]);

  return (
    <Form {...form}>
      <fetcher.Form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 md:max-w-lg p-4"
      >
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

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
                <Input placeholder="Enter team name" {...field} />
              </FormControl>
              <FormDescription>The name of your team.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="billingEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Billing Email</FormLabel>
              <FormControl>
                <Input placeholder="e.g. billing@company.com" {...field} />
              </FormControl>
              <FormDescription>
                Invoices and receipts will be sent to this address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="justify-self-end"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Save
        </Button>
      </fetcher.Form>
    </Form>
  );
}
