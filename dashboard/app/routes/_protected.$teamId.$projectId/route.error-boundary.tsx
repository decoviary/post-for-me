import { isRouteErrorResponse } from "react-router";

import type { Route } from "../_protected/+types/route";

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto flex flex-col gap-2 items-center justify-center text-center">
      <img src="/error.png" className="h-32" />
      <h1 className="text-2xl font-bold">{message}</h1>
      <p>{details}</p>
      {stack ? (
        <pre className="w-full p-4 overflow-x-auto bg-muted text-muted-foreground border rounded-lg text-left font-mono">
          <code>{stack}</code>
        </pre>
      ) : null}
    </main>
  );
}
