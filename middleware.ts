import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE } from "./lib/constants";

export function middleware(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const { pathname } = req.nextUrl;

  const publicPrefixes = ["/", "/login", "/signup", "/submit"];

  const isPublic =
    publicPrefixes?.some((p) => pathname === p || pathname?.startsWith(`${p}/`));

  if (isPublic) {
    if (token && (pathname === "/login" || pathname === "/signup" || pathname === "/")) {
      return NextResponse.redirect(new URL("/teacher/assignments", req.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif|css|js|woff2?|ttf|eot)).*)",
  ],
};