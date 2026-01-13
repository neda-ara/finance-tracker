import { ROUTES } from "../constants/constants";

export const AUTH_ROUTES = new Set([ROUTES.AUTH.LOGIN, ROUTES.AUTH.SIGNUP]);

export const PROTECTED_ROUTES = new Set([ROUTES.DASHBOARD.EXPENSES]);

export function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.has(pathname);
}

export function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.has(pathname);
}
