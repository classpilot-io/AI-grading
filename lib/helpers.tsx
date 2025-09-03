
import Cookies from "js-cookie";
import { AUTH_COOKIE, BASE_URL } from "./constants";

export const ROLE = {
  STUDENT: "student",
  TEACHER: "teacher",
};

// GET Fetcher (for GET requests only)
 
export async function GetFetcher<T>(url: string): Promise<T> {
  const token = Cookies.get(AUTH_COOKIE);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`GET request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
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

  if (!res.ok) {
    throw new Error(`${method} request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
