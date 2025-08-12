import { useLoaderData } from "react-router";
import type { loader } from "./route.loader";

const getProviderDisplayName = (provider: string | undefined) => {
  if (!provider) return "Unknown";

  const providers: Record<string, string> = {
    x: "Twitter/X",
    instagram: "Instagram",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    tiktok: "TikTok",
    youtube: "YouTube",
    bluesky: "Bluesky",
    threads: "Threads",
    pinterest: "Pinterest",
  };
  return providers[provider.toLowerCase()] || provider;
};

const getStatusIcon = (isSuccess: boolean) => {
  if (isSuccess) {
    return (
      <div className="rounded-full bg-green-100 p-4">
        <svg
          className="h-8 w-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    );
  } else {
    return (
      <div className="rounded-full bg-red-100 p-4">
        <svg
          className="h-8 w-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    );
  }
};

const getStatusColor = (isSuccess: boolean) => {
  return isSuccess ? "text-green-800" : "text-red-800";
};

export function Component() {
  const { isSuccess, error, isLoggedIn, teamId, projectId, provider } =
    useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Post for Me</h1>
          </div>

          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {getStatusIcon(isSuccess)}
          </div>

          {/* Status Message */}
          <div className="space-y-4">
            <h2
              className={`text-xl font-semibold ${getStatusColor(isSuccess)}`}
            >
              {isSuccess ? "Account Connected!" : "Connection Failed"}
            </h2>

            <div className="space-y-2">
              <p className="text-gray-600">
                <strong>{getProviderDisplayName(provider)}</strong>
              </p>
              {error ? (
                <p className="text-sm text-gray-500 mt-2">Error: {error}</p>
              ) : null}
            </div>

            {isSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4">
                <p className="text-green-800 text-sm">
                  You can now schedule and publish posts to your{" "}
                  {getProviderDisplayName(provider)} account.
                </p>
              </div>
            ) : null}

            {!isSuccess ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
                <p className="text-red-800 text-sm">
                  Don&apos;t worry, you can try connecting your account again.
                </p>
              </div>
            ) : null}

            {isLoggedIn && teamId && projectId ? (
              <div className="mt-6">
                <a
                  href={`/${teamId}/${projectId}/accounts`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Accounts
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
