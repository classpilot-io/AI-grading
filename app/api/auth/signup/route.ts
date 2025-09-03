import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/services/supabase/server";
import {
  generateErrorResponse,
  generateResultResponse,
} from "@/lib/responseUtils";
import { HTTP_STATUS_CODES } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password || !name || !role) {
      return generateErrorResponse(
        "Missing or invalid required parameters",
        HTTP_STATUS_CODES.HTTP_BAD_REQUEST
      );
    }

    const supabase = createServerSupabaseClient();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !signUpData?.user) {
      return generateErrorResponse(
        signUpError?.message || "Signup failed. Please try again.",
        signUpError?.status || HTTP_STATUS_CODES.HTTP_BAD_REQUEST
      );
    }

    const supabaseUser = signUpData.user;

    const { data: user, error: userInsertError } = await supabase
      .from("User")
      .insert({
        id: supabaseUser.id,
        email,
        name,
        role,
        passwordHash: "", // Supabase handles password storage
      })
      .select()
      .maybeSingle();
      if (userInsertError) return generateErrorResponse(userInsertError.message, HTTP_STATUS_CODES.HTTP_INTERNAL_SERVER_ERROR);

    return generateResultResponse({ message: "Signup successful!" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
