import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/admin"];
const LOGIN_PATH = "/admin/login";
const COOKIE_NAME = "araq_admin_token";
const COOKIE_VALUE = "authenticated_admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === LOGIN_PATH;

  if (!isAdminRoute) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isAuthenticated = token === COOKIE_VALUE;

  // If already authenticated and visiting /admin/login → redirect to dashboard
  if (isLoginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // If NOT authenticated and visiting any /admin/* page (except login) → redirect to login
  if (!isLoginRoute && !isAuthenticated) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
