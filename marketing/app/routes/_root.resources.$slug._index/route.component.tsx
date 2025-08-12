import { Link, useLoaderData } from "react-router";

import { RawHtml } from "~/components/raw-html";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/ui/breadcrumb";
import { Separator } from "~/ui/separator";
import { SidebarProvider, SidebarInset } from "~/ui/sidebar";

import { ResourcesSidebar } from "./_resources-sidebar";

import type { Route } from "./+types/route";

export function Component() {
  const { title, summary, blocks } =
    useLoaderData<Route.ComponentProps["loaderData"]>();

  return (
    <div className="relative container mx-auto px-4">
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Resources</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{title}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-4xl font-semibold">{title}</h1>
      <p className="mb-4 max-w-2xl text-lg text-muted-foreground">{summary}</p>

      <Separator className="mt-6 mb-5" />

      <SidebarProvider
        style={{ "--sidebar-width": "11rem" } as React.CSSProperties}
      >
        <SidebarInset>
          <section className="md:grid md:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] md:gap-12">
            <aside className="hidden md:block sticky top-28">
              <ResourcesSidebar />
            </aside>

            <article className="prose max-w-none pt-2.5 space-y-4">
              {blocks.map((block, i) =>
                block ? <RawHtml key={i} html={block} /> : null
              )}
            </article>
          </section>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
