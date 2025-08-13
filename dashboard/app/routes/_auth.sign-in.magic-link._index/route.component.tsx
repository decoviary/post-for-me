import { SignInForm } from "./_sign-in-form";
import { ErrorAlert } from "./_error-alert";

export function Component() {
  return (
    <div className="flex flex-col gap-8">
      <SignInForm />
      <ErrorAlert />
    </div>
  );
}
