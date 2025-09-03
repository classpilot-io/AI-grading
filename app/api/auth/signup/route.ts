import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json();

    // 1. Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    //   email_confirm: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const supabaseUser = data.user;

    // 2. Create user in Prisma DB
    const user = await prisma.user.create({
      data: {
        id: supabaseUser?.id,
        email,
        name,
        role,
        passwordHash: '', // Not used since Supabase handles passwords
      },
    });

    return NextResponse.json({ message: 'User created successfully'});
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
