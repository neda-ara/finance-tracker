import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET_KEY);
const COOKIE_NAME = "session";

export async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string };
  } catch {
    return null;
  }
}
