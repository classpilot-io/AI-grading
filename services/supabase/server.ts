import { createServerClient, serializeCookieHeader } from "@supabase/ssr";
import type { NextApiRequest, NextApiResponse } from "next";
// import { Database } from "./database.types";

export async function createServerSupabaseClient(
    req: NextApiRequest,
    res: NextApiResponse
) {
    return createServerClient<any>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return Object.keys(req.cookies).map((name) => ({
                        name,
                        value: req.cookies[name] || "",
                    }));
                },
                setAll(cookiesToSet) {
                    res.setHeader(
                        "Set-Cookie",
                        cookiesToSet.map(({ name, value, options }) => {
                            const isAuthToken =
                                name.includes("access_token") ||
                                name.includes("refresh_token") ||
                                name.includes("auth-token");
                            options.httpOnly = !isAuthToken;
                            return serializeCookieHeader(name, value, options);
                        })
                    );
                },
            },
        }
    );
}
