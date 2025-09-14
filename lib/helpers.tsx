import Cookies from "js-cookie";
import { AUTH_COOKIE, BASE_URL } from "./constants";

export const ROLE = {
  STUDENT: "student",
  TEACHER: "teacher",
};

// Type for your common API response
interface ApiResponse<T> {
  statusCode: number;
  hasError: boolean;
  result: T;
  errors: any[];
}

// GET Fetcher (for GET requests only)
export async function GetFetcher<T>(url: string): Promise<T> {
  const token = Cookies.get(AUTH_COOKIE);

  const res = await fetch(BASE_URL + "/api" + url, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`GET request failed: ${res.status} ${res.statusText}`);
  }

  const data: ApiResponse<T> = await res.json();

  if (data.hasError) {
    throw new Error(data.errors?.[0]?.message || "Something went wrong.");
  }

  return data.result;
}

// Flexible Fetcher (POST, PUT, PATCH, DELETE) with JSON & FormData support
export async function PostFetcher<T>(
  url: string,
  body: Record<string, any> | FormData,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST"
): Promise<T> {
  const token = Cookies.get(AUTH_COOKIE);

  const isFormData = body instanceof FormData;

  const res = await fetch(BASE_URL + "/api" + url, {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: isFormData ? (body as FormData) : JSON.stringify(body),
    credentials: "include",
  });

  //   if (!res.ok) {
  //     throw new Error(`${method} request failed: ${res.status} ${res.statusText}`);
  //   }

  const data: any = await res.json();

  if (data.hasError) {
    return data;
  }

  return data.result;
}

export const sanitizeFileName = (name: string) => {
  if (!name) return "file";
  return name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
};

export const MATHEMATICS_GRADING_PROMPT = `
        You are an expert grader. Analyze the following student submission and grade it based on the criteria provided. The submission contains a question followed by a handwritten answer.
        
        Instructions for Grading Process:
        1. **Analyze the Document Structure:** First, carefully examine the entire submission file to identify the distinct questions and their corresponding parts. Note the marks allocated for each question and part.
        2. **Extract Content:** For each question and part, accurately extract the following:
            * The question text.
            * The student's handwritten answer text.
            * The total marks available for that question or part.
        3. **Grade Each Part:** Evaluate the student's answer for each part separately. Assign marks based on the correctness and completeness of the response.
        4. **Determine Correctness:** If the student's answer is incorrect, or if a step is missing, formulate the correct answer. Determine the status as "Correct" or "Incorrect" based on the awarded marks.
        5. **Aggregate Marks:** Sum the marks for all parts within a single question to get the total awarded marks for that question. Then, sum all awarded question marks to get the total awarded marks for the entire submission.
        6. **Format the Final Output:** Based on the analysis, generate a single JSON object that strictly adheres to the specified schema below. **Ensure that all text fields, such as 'answer_text' and 'question_text', contain no unescaped newline characters. If a line break is needed, represent it with '\\n'.**
        
        Grading Rubric:
        - For each question, provide a per-question grade, including both awarded marks and total marks.
        - If a question has parts, provide a per-part grade, including awarded marks and total marks, and a total for the question.
        - For each question and part, include a 'status' field with the value "Correct" or "Incorrect".
        - If the student's answer is incorrect, provide the correct answer in the "correct_answer" field. Otherwise, set the field to "null".
        - Calculate the total awarded marks out of the total papers marks for the entire submission.
        
        Response format should be a JSON object:
        {
          "grades": [
            {
              "question_number": "...",
              "question_text": "...",
              "answer_text": "...",
              "correct_answer": "...",
              "awarded_marks": "...",
              "total_marks": "...",
              "status": "...",
              "parts": [
                {
                  "part_number": "...",
                  "question_text": "...",
                  "answer_text": "...",
                  "correct_answer": "...",
                  "awarded_marks": "...",
                  "total_marks": "...",
                  "status": "..."
                },
                ...
              ]
            },
            ...
          ],
          "submission_awarded_marks": "...",
          "submission_total_marks": "..."
        }
        
        All mathematical notations, including symbols, fractions, and equations, must be represented using LaTeX. Enclose inline math within '$' and display math within '$$' to ensure correct rendering via MathJax or KaTeX.
      `;

export const ENGLISH_GRADING_PROMPT = `
        You are an AI-powered evaluation tool for English papers, providing professional analysis for a teacher's dashboard. Your goal is to deliver a direct, objective assessment of the student's writing.
        
        Instructions for Grading Process:
        1. **Analyze the Document:** Conduct a comprehensive analysis of the student's submission, focusing on key writing elements such as grammar, syntax, spelling, sentence structure, logical flow, and clarity of the argument.
        2. **Provide a Grade:** Based on your analysis, assign an awarded mark out of a total of 100.
        3. **Formulate Analysis:** Provide a detailed analysis that highlights specific strengths and identifies concrete areas for improvement. This analysis should be clinical, direct, and focused on professional observations for the teacher's use.
        4. **Format the Final Output:** Generate a single JSON object that strictly adheres to the specified schema below. Your \`summary\` and \`detailed_feedback\` fields should be formatted using Markdown for improved readability, including headings, bold text, and bullet points as appropriate.
        
        Response format should be a JSON object:
        {
          "submission_awarded_marks": "...",
          "submission_total_marks": "100",
          "summary": "...",
          "detailed_feedback": "..."
        }
      `;

export const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
