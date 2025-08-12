import { NewPasswordForm } from "./_new-password-form";
import { ErrorAlert } from "./_error-alert";

export function Component() {
  return (
    <div className="flex flex-col gap-8">
      <NewPasswordForm />
      <ErrorAlert />
    </div>
  );
}
