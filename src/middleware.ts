import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/de", request.url));
  }

  const isAdmin = /^\/(de|en)\/admin/.test(pathname);
  const isPortal =
    /^\/(de|en)\/portal/.test(pathname) && !pathname.includes("/portal/login");

  if (isAdmin || isPortal) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const locale = pathname.startsWith("/en") ? "en" : "de";
      const login = new URL(`/${locale}/portal/login`, request.url);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }

    if (isAdmin && token.role !== "ADMIN") {
      const locale = pathname.startsWith("/en") ? "en" : "de";
      return NextResponse.redirect(new URL(`/${locale}/portal`, request.url));
    }

    if (isPortal && token.role !== "CLIENT" && token.role !== "ADMIN") {
      const locale = pathname.startsWith("/en") ? "en" : "de";
      return NextResponse.redirect(new URL(`/${locale}/portal/login`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
