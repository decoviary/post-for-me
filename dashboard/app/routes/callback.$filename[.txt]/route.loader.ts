import { withSupabase } from "~/lib/.server/supabase";

export const loader = withSupabase(async ({ params, supabaseServiceRole }) => {
  let { filename } = params;

  if (!filename) {
    return new Response("Filename not provided", { status: 400 });
  }

  if (!filename.includes(".txt")) {
    filename = filename + ".txt";
  }

  const { data } = await supabaseServiceRole.storage
    .from("post-media")
    .download(filename);

  if (!data) {
    return new Response("File Not Found", { status: 404 });
  }

  if (!data?.type?.includes("text/plain")) {
    return new Response("Invalid file type. Only .txt files are allowed", {
      status: 400,
    });
  }

  return new Response(data, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
});
