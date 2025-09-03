import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerSupabaseClient } from '@/services/supabase/server';
import { generateErrorResponse, generateResultResponse } from '@/lib/responseUtils';
import { HTTP_STATUS_CODES } from '@/lib/constants';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return generateErrorResponse(res, "Method not allowed. Only POST requests are accepted.", HTTP_STATUS_CODES.HTTP_METHOD_NOT_ALLOWED);

  try {
    const { email, password, name, role } = await req.body;
    if (!email || !password || !name || !role) return generateErrorResponse(res, "Missing or invalid required parameterss", HTTP_STATUS_CODES.HTTP_BAD_REQUEST);

    const supabase = await createServerSupabaseClient(req, res);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password
            //   email_confirm: true,
        });

        if (signUpError || !signUpData?.user) {
            return generateErrorResponse(
                res,
                signUpError?.message || 'Signup failed. Please try again.',
                signUpError?.status || HTTP_STATUS_CODES.HTTP_BAD_REQUEST
            );
        }

        const supabaseUser = signUpData.user;
    
        // 2. Create user in Prisma DB
        const {data:user, error: userError} = await prisma.user.create({
          data: {
            id: supabaseUser?.id,
            email,
            name,
            role,
            passwordHash: '', // Not used since Supabase handles passwords
          },
        });

        if (userError) {
            return generateErrorResponse(
                res,
                userError?.message || 'Failed signup in supabase. Please try again.', HTTP_STATUS_CODES.HTTP_BAD_REQUEST
            );
        }

        return generateResultResponse(res, { message: 'Signup successful!' });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
