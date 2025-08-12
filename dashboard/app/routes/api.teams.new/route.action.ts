import { redirect, data } from "react-router";
import { withSupabase } from "~/lib/.server/supabase";

export const action = withSupabase(
  async ({ request, supabase, supabaseServiceRole }) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      throw redirect("/logout");
    }

    const formData = await request.formData();
    const name = (formData.get("name") as string)?.trim();

    if (!name || name.length < 2 || name.length > 50) {
      return data({
        success: false,
        errors: { name: "Team name must be between 2 and 50 characters." },
      });
    }

    const result = await supabaseServiceRole
      .from("teams")
      .insert({
        name,
        created_by: userData?.user?.id,
      })
      .select()
      .single();

    if (result.error) {
      console.error(result.error);
      return data({
        success: false,
        errors: { general: "Something went wrong creating the team." },
      });
    }

    const teamId = result.data.id;

    // Return success data instead of redirecting
    return data({
      success: true,
      teamId: teamId,
      message: "Team created successfully",
    });
  }
);
