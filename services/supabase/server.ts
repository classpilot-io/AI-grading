import { cookies } from "next/headers";
//@ts-ignore
import { createServerClient } from "@supabase/ssr";

export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const isAuthToken =
              name.includes("access_token") ||
              name.includes("refresh_token") ||
              name.includes("auth-token");

            options.httpOnly = isAuthToken;
            cookieStore.set({ name, value, ...options });
          });
        },
      },
    }
  );
}
