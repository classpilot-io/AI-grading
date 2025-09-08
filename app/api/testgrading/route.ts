// app/api/test/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fire the fetch in background (no await)
    fetch(`${process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL}/hello-world`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ name: "Next.js Client" }),
    }).catch((err) => {
      console.error("Background Edge Function call failed:", err);
    });

    // Immediately return success response
    return NextResponse.json({
      statusCode: 200,
      hasError: false,
      result: "Edge function triggered successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
