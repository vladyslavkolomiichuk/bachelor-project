"use server";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const publicRoutes = ["/login", "/signup", "/", '/book'];

export default async function middleware(req) {
  const { pathname } = req.nextUrl;
  
  const isPublicRoute = publicRoutes.some((route) => {
    return pathname === route || pathname.startsWith(route);
  });

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const sessionCookie = (await cookies()).get("auth_session");

  if (!sessionCookie && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (sessionCookie && isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
