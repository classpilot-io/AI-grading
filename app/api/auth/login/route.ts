import { NextResponse } from 'next/server';
import { generateErrorResponse, generateResultResponse } from '@/lib/responseUtils';
import { HTTP_STATUS_CODES } from '@/lib/constants';
import { createServerSupabaseClient } from '@/services/supabase/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return generateErrorResponse("Email and password are required", HTTP_STATUS_CODES.HTTP_BAD_REQUEST);

    const supabase = await createServerSupabaseClient();

    const { data: userData, error: userError } = await supabase.auth.signInWithPassword({ email, password });
    if (userError) {
      if (userError.code == "email_not_confirmed")
        return generateErrorResponse("Email verification required.", HTTP_STATUS_CODES.HTTP_BAD_REQUEST);
      return generateErrorResponse(userError.message, HTTP_STATUS_CODES.HTTP_BAD_REQUEST);
    }

    return generateResultResponse(
      { 
        access_token: userData?.session?.access_token, 
        user: userData?.user 
      });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
