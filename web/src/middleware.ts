import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, *.svg, *.png, *.jpg, *.jpeg, *.gif, *.webp (image files)
     * - signin (signin page)
     * - signup (signup page)
     * - forgot-password (forgot password page)
     * - reset-password (reset password page)
     * - verify-email (email verification page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$|signin|signup|forgot-password|reset-password|verify-email).*)",
  ],
};
