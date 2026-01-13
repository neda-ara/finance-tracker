import { getSessionFromRequest } from "./lib/auth/session-middleware";
import { isAuthRoute, isProtectedRoute } from "./lib/auth/routes-access";
import { NextResponse } from "next/server";
import { ROUTES } from "@/lib/constants/constants";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSessionFromRequest(request);

  if (!session && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, request.url));
  }

  if (session && isAuthRoute(pathname)) {
    return NextResponse.redirect(
      new URL(ROUTES.DASHBOARD.EXPENSES, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
