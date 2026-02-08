"use server";

import { ActionResult } from "./types";
import { getSession } from "../auth/session";
import { UNAUTHORIZED_ERR_MSG } from "../constants/constants";

type ActionError = Error & { fieldErrors?: Record<string, string> };

export async function safeRunAction<T>(
  fn: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (err) {
    const error = err as ActionError;
    return {
      ok: false,
      error: {
        message: error?.message,
        fieldErrors: error?.fieldErrors,
      },
    };
  }
}

export async function getAuthenticatedSession() {
  const session = await getSession();
  if (!session) {
    throw new Error(UNAUTHORIZED_ERR_MSG);
  }
  return session;
}
