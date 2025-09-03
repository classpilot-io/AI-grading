import { createServerSupabaseClient } from "@/services/supabase/server";

export async function requireRole(req: Request, allowedRoles: string[]) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, supabase, error: "Unauthorized" };
  }

  const { data: userData, error: userError } = await supabase
    .from("User")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (userError || !userData || !allowedRoles.includes(userData.role)) {
    return { user: null, supabase, error: "Unauthorized" };
  }

  return { user, role: userData.role, supabase, error: null };
}
