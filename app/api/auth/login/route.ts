import { NextResponse } from "next/server";
import {
  generateErrorResponse,
  generateResultResponse,
} from "@/lib/responseUtils";
import { HTTP_STATUS_CODES } from "@/lib/constants";
import { createServerSupabaseClient } from "@/services/supabase/server";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();
    if (!email || !password || !role)
      return generateErrorResponse(
        "Email and password are required",
        HTTP_STATUS_CODES.HTTP_BAD_REQUEST
      );

    const supabase = await createServerSupabaseClient();

    const { data: userData, error: userError } =
      await supabase.auth.signInWithPassword({ email, password });
    if (userError) {
      if (userError.code == "email_not_confirmed")
        return generateErrorResponse(
          "Email verification required.",
          HTTP_STATUS_CODES.HTTP_BAD_REQUEST
        );
      return generateErrorResponse(
        userError.message,
        HTTP_STATUS_CODES.HTTP_BAD_REQUEST
      );
    }

    // Step 2: Fetch role from your own User table (Prisma)
    const { data: dbUser, error: dbUserError } = await supabase
      .from("User")
      .select("id, name, email, role")
      .eq("id", userData?.user?.id)
      .maybeSingle();

    if (!dbUser) {
      return generateErrorResponse(
        "User not found in app database",
        HTTP_STATUS_CODES.HTTP_BAD_REQUEST
      );
    }
    if (!dbUser.role || dbUser.role !== role) {
      return generateErrorResponse(
        "User role mismatch",
        HTTP_STATUS_CODES.HTTP_UNAUTHORIZED
      );
    }

    return generateResultResponse({
      access_token: userData?.session?.access_token,
      user: {
        role: dbUser.role,
        name: dbUser.name,
        email: dbUser.email,
        userId: dbUser.id,
      },
      // user: userData?.user
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
