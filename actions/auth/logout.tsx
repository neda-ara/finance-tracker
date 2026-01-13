"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "session";

export async function logout() {
  (await cookies()).delete(COOKIE_NAME);
}
