import { useLoaderData } from "react-router";

import { RawHtml } from "~/components/raw-html";

import type { Route } from "./+types/route";

export function PrivacyPolicy() {
  const data = useLoaderData<Route.ComponentProps["loaderData"]>();

  return <RawHtml html={data.content} />;
}
