import { Outlet, useLoaderData } from "react-router";
import { PostsDataTable } from "./_data-table";

import type { loader } from "./route.loader";

export function Component() {
  const data = useLoaderData<typeof loader>();
  
  return (
    <div className="space-y-4">
      <div className="px-1">
        <h2 className="font-semibold text-lg">Posts</h2>
      </div>

      <PostsDataTable data={data} />

      <Outlet />
    </div>
  );
}
