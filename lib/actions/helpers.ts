"use server";

import { ActionResult } from "./types";
import { getSession } from "../auth/session";
import { UNAUTHORIZED_ERR_MSG } from "../constants/constants";

type ActionError = Error & { fieldErrors?: Record<string, string> };

export async function safeRunAction<T>(
  fn: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data };
  } catch (err) {
    const actionError = err as ActionError;

    const message =
      actionError?.message || // validation or manual errors
      (err instanceof Error ? err.message : undefined) || // DB/network errors
      "Unexpected server error";

    return {
      ok: false,
      error: {
        message,
        fieldErrors: actionError?.fieldErrors,
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
