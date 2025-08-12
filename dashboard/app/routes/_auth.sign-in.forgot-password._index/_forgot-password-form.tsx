import { useState } from "react";
import { Link } from "react-router";
import { MailIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { useForm } from "~/hooks/use-form";

import { Button } from "~/ui/button";
import { Input } from "~/ui/input";
import { Label } from "~/ui/label";

import { EmailAlert } from "./_email-alert";

export function ForgotPasswordForm() {
  const { Form, isSubmitting, data } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const disabled = isSubmitting;
  const loading = isSubmitting ? "email" : null;

  if (data?.success && !submitted) {
    setSubmitted(true);
  }

  if (submitted) {
    return <EmailAlert />;
  }

  return (
    <Form className={cn("flex flex-col gap-6")} method="post">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email to receive a reset link.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={disabled}
          loading={loading === "email"}
          onClick={() => setSubmitted(false)}
        >
          Send reset link <MailIcon />
        </Button>

        <Button asChild variant="secondary" className="w-full">
          <Link to="/_auth/sign-in">Back to Sign In</Link>
        </Button>
      </div>
    </Form>
  );
}
