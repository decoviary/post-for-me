import {
  Copyable,
  CopyableContent,
  CopyableTrigger,
  CopyableIcon,
} from "~/ui/copyable";

import { Label } from "~/ui/label";
import type { Route } from "./+types/route";
import { useLoaderData } from "react-router";

export function CopyableValues() {
  const { redirectUrl, callbackUrl, dataUrl } =
    useLoaderData<Route.ComponentProps["loaderData"]>();

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="space-y-1 w-full">
        <Label htmlFor="redirect-url">Redirect URL</Label>
        <Copyable value={redirectUrl}>
          <CopyableTrigger>
            <CopyableContent />
            <CopyableIcon />
          </CopyableTrigger>
        </Copyable>
      </div>

      <div className="space-y-1 w-full shrink-0">
        <Label htmlFor="redirect-url">Verify URL Properties</Label>
        <Copyable value={callbackUrl}>
          <CopyableTrigger>
            <CopyableContent />
            <CopyableIcon />
          </CopyableTrigger>
        </Copyable>
        <Copyable value={dataUrl}>
          <CopyableTrigger>
            <CopyableContent />
            <CopyableIcon />
          </CopyableTrigger>
        </Copyable>
      </div>
    </div>
  );
}
