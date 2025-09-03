import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateErrorResponse, generateResultResponse } from '@/lib/responseUtils';
import { HTTP_STATUS_CODES } from '@/lib/constants';
import { createServerSupabaseClient } from '@/services/supabase/server';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return generateErrorResponse(res, "Method not allowed", HTTP_STATUS_CODES.HTTP_METHOD_NOT_ALLOWED);

  try {
    const { email, password } = await req.body;
    if (!email || !password) return generateErrorResponse(res, "Email and password are required", HTTP_STATUS_CODES.HTTP_BAD_REQUEST);

    const supabase = await createServerSupabaseClient(req, res);

    const { data: userData, error: userError } = await supabase.auth.signInWithPassword({ email, password });
    if (userError) {
      if (userError.code == "email_not_confirmed")
        return generateErrorResponse(res, "Email verification required.", HTTP_STATUS_CODES.HTTP_BAD_REQUEST);
      return generateErrorResponse(res, userError.message, HTTP_STATUS_CODES.HTTP_BAD_REQUEST);
    }

    const { user, session } = userData;

    // Get user profile from Prisma
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    
    return generateResultResponse(res, { access_token: session?.access_token, user:dbUser });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
