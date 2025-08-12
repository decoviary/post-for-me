import { toast } from "sonner";
import { useForm } from "react-hook-form";

import { useForm as useFormFetcher } from "~/hooks/use-form";

import { Button } from "~/ui/button";
import { Input } from "~/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "~/ui/form";
import { useEffect } from "react";

interface AccountFormData {
  firstName: string;
  lastName: string;
}

export function AccountForm() {
  const { fetcher, isSubmitting, data } = useFormFetcher({ withToast: true });

  const form = useForm<AccountFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const handleSubmit = async (formData: AccountFormData) => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("Missing Information", {
        description: "Please fill in both first and last name.",
      });
      return;
    }

    fetcher.submit(
      {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      },
      {
        method: "POST",
        action: "/account",
      }
    );
  };

  useEffect(() => {
    fetcher.load("/account");
  }, []);

  useEffect(() => {
    if (data?.user) {
      form.reset({
        firstName: data.user.firstName || "",
        lastName: data.user.lastName || "",
      });
    }
  }, [data]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid gap-4 py-4"
      >
        <FormItem>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            type="email"
            value={`${data?.user?.email}`}
            readOnly
            className="bg-muted"
          />
        </FormItem>

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your first name"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your last name"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="w-full flex flex-row justify-end">
          <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
