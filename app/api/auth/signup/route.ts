// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    // App Router Supabase client (no req/res needed)
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

    // Create user in Prisma DB
    await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email,
        name,
        role,
        passwordHash: "", // Supabase handles password storage
      },
    });

    return generateResultResponse({ message: "Signup successful!" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
