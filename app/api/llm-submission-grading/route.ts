// Without await version
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { submissionId, question, answerText } = await req.json();

    fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL}llm-submission-grading`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`, // or service key if secure
        },
        body: JSON.stringify({ question, answerText, submissionId }),
      }
    ).catch((err) => console.error("Edge function error:", err));

    return NextResponse.json({ success: true, message: "Grading started" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// With await version
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const { submissionId, question, answerText } = await req.json();

//     // Await edge function response
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL}llm-perform-marking`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, // use service role if you want secure function
//         },
//         body: JSON.stringify({ submissionId, question, answerText }),
//       }
//     );

//     if (!response.ok) {
//       const errText = await response.text();
//       return NextResponse.json(
//         { error: `Edge function failed: ${errText}` },
//         { status: response.status }
//       );
//     }

//     const data = await response.json();

//     return NextResponse.json({
//       success: true,
//       message: "Grading completed",
//       result: data,
//     });
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
