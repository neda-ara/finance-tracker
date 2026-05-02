import { ROUTES } from "../constants/constants";

interface RouteTree {
  [key: string]: string | RouteTree;
}

const flattenRoutes = (obj: RouteTree): string[] =>
  Object.values(obj).flatMap((val) =>
    typeof val === "string" ? val : flattenRoutes(val),
  );

const { AUTH, CREDITS, ...PROTECTED } = ROUTES;

const AUTH_ROUTES = new Set(flattenRoutes(AUTH));
const PROTECTED_ROUTES = new Set(flattenRoutes(PROTECTED));

export function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.has(pathname);
}

export function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.has(pathname);
}
