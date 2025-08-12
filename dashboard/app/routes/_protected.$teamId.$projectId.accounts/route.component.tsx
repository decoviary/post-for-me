import { Outlet, useLoaderData } from "react-router";
import { Link } from "react-router";
import { SocialConnectionsDataTable } from "./_data-table";
import { Button } from "~/ui/button";
import { PersonAddIcon } from "icons";

import type { loader } from "./route.loader";

export function Component() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="px-1">
          <h2 className="font-semibold text-lg">Connected Accounts</h2>
          <p className="text-sm text-muted-foreground">
            {`Manage your project's connected social media accounts.`}
          </p>
        </div>

        <Button asChild>
          <Link to="connect">
            <PersonAddIcon />
            <span>Connect an account</span>
          </Link>
        </Button>
      </div>

      <SocialConnectionsDataTable data={data} />

      <Outlet />
    </div>
  );
}
