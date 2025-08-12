import { data, redirect } from "react-router";
import { marked } from "marked";

import { withSupabase } from "~/lib/.server/supabase";

type Block = {
  type: string;
  content: string;
};

export const loader = withSupabase(async function ({
  params,
  supabase,
  request,
}) {
  const { slug } = params;

  if (!slug) {
    throw new Response("Not Found", { status: 404 });
  }

  const redirectResponse = await supabase
    .schema("cms")
    .from("slug_redirects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (redirectResponse.data) {
    const redirectUrl = `/resources/${redirectResponse.data.target_slug}`;
    return redirect(redirectUrl, redirectResponse.data.http_status);
  }

  const resource = await supabase
    .schema("cms")
    .from("resources")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!resource.data || resource.error) {
    throw new Response("Not Found", { status: 404 });
  }

  const bodyBlocks: Block[] = Array.isArray(resource.data.body_blocks)
    ? (resource.data.body_blocks as Block[])
    : [];

  // Get site name from request host
  const url = new URL(request.url);
  const siteName = url.hostname;

  return data({
    // Resource data properties directly
    title: resource.data.title,
    summary: resource.data.summary,
    slug: resource.data.slug,
    created_at: resource.data.created_at,
    updated_at: resource.data.updated_at,
    seo_meta:
      (resource.data.seo_meta as {
        title?: string;
        description?: string;
        keywords?: string;
      }) || {},

    // Site info
    siteName,
    siteUrl: `${url.protocol}//${url.host}-api`,

    // Processed content
    blocks: await Promise.all(
      bodyBlocks.map((block) => {
        if (block?.type === "markdown") {
          return marked(block.content);
        }

        if (block?.type === "html") {
          return block.content;
        }

        return Promise.resolve(null);
      })
    ),

    // Sidebar data
    sidebar: [
      {
        title: "Getting Started Guides",
        links: [
          {
            title: "TikTok",
            href: `/resources/getting-started-with-the-tiktok-api`,
          },
          {
            title: "Facebook",
            href: `/resources/getting-started-with-the-facebook-api`,
          },
          {
            title: "Instagram",
            href: `/resources/getting-started-with-the-instagram-api`,
          },
          {
            title: "YouTube",
            href: `/resources/getting-started-with-the-youtube-api`,
          },
          {
            title: "LinkedIn",
            href: `/resources/getting-started-with-the-linkedin-api`,
          },
          {
            title: "X",
            href: `/resources/getting-started-with-the-x-api`,
          },
          {
            title: "Bluesky",
            href: `/resources/getting-started-with-the-bluesky-api`,
          },
          {
            title: "Pinterest",
            href: `/resources/getting-started-with-the-pinterest-api`,
          },
          {
            title: "Threads",
            href: `/resources/getting-started-with-the-threads-api`,
          },
        ],
      },
    ],
  });
});
