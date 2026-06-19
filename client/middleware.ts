import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/admin"];
const LOGIN_PATH = "/admin/login";
const COOKIE_NAME = "araq_admin_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === LOGIN_PATH;

  if (!isAdminRoute) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  
  let isAuthenticated = false;
  if (token) {
    try {
      // Validate the admin token with the backend directly
      const verifyRes = await fetch(new URL("/api/admin/auth", request.url), {
        headers: {
          cookie: `${COOKIE_NAME}=${token}`
        },
        cache: "no-store"
      });
      isAuthenticated = verifyRes.ok;
    } catch (err) {
      console.error("Admin token verification request failed in middleware:", err);
      isAuthenticated = false;
    }
  }

  // If already authenticated and visiting /admin/login → redirect to dashboard
  if (isLoginRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // If NOT authenticated and visiting any /admin/* page (except login) → redirect to login
  if (!isLoginRoute && !isAuthenticated) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    
    // Clear forged/invalid cookie and redirect
    const response = NextResponse.redirect(loginUrl);
    if (token) {
      response.cookies.delete(COOKIE_NAME);
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
