import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { user, session } = data;

    // Get user profile from Prisma
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    return NextResponse.json({
      user: dbUser,
      session,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
