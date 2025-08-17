import { NextResponse, NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

export const locales = ["en", "ru"];

function getLocale(request: NextRequest): string {
  const headers = new Headers(request.headers);
  const acceptLanguage = headers.get("accept-language");

  if (acceptLanguage) {
    headers.set("accept-language", acceptLanguage.replaceAll("_", "-"));
  }

  return locales[1]; // Return 'ru' as default
}

const { auth } = NextAuth(authConfig);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle auth for login and admin routes (no locale needed)
  if (pathname.startsWith("/login") || pathname.startsWith("/admin")) {
    const session = await auth();

    if (pathname.startsWith("/login")) {
      if (session) {
        // Используем относительный путь для редиректа
        const adminUrl = new URL("/admin", request.nextUrl);
        return NextResponse.redirect(adminUrl);
      }
      return NextResponse.next();
    }

    if (pathname.startsWith("/admin")) {
      if (!session) {
        // Используем относительный путь для редиректа
        const loginUrl = new URL("/login", request.nextUrl);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.next();
    }
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  const isStaticFile = /\.(jpg|jpeg|png|gif|svg|css|js)$/.test(pathname);

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || isStaticFile) {
    return NextResponse.next();
  }

  // If no locale and not login/admin, add locale
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
