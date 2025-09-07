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
  name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
};
