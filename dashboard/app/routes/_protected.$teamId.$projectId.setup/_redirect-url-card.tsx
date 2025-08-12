import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm as useFormFetcher } from "~/hooks/use-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/ui/form";
import { Input } from "~/ui/input";
import { Button } from "~/ui/button";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/route";

const redirectUrlSchema = z.object({
  auth_callback_url: z.string().url("Please enter a valid URL"),
});

type RedirectUrlFormValues = z.infer<typeof redirectUrlSchema>;

export function RedirectUrlCard() {
  const { authCallbackUrl } =
    useLoaderData<Route.ComponentProps["loaderData"]>();

  const { fetcher, isSubmitting } = useFormFetcher();
  const form = useForm<RedirectUrlFormValues>({
    resolver: zodResolver(redirectUrlSchema),
    defaultValues: {
      auth_callback_url: authCallbackUrl,
    },
  });

  function onSubmit(data: RedirectUrlFormValues) {
    fetcher.submit(data, {
      method: "post",
      action: "redirect-url",
    });
  }

  return (
    <Card className="col-span-full @xl:flex-row @xl:justify-between">
      <CardHeader className="flex-1">
        <CardTitle>Project Redirect URL</CardTitle>
        <CardDescription>
          Optionally, enter the URL where users should be redirected after
          successfully connecting their social media account. This is typically
          a page on your application that confirms the connection or continues
          the onboarding flow.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="auth_callback_url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Url</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-card"
                        placeholder="https://your-url.com/auth/callback"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-destructive etmpty:hidden">
                      {form.formState.errors.auth_callback_url?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />

              <Button
                className="self-end"
                disabled={
                  !form.formState.isValid ||
                  !form.formState.isDirty ||
                  isSubmitting
                }
                loading={isSubmitting}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
