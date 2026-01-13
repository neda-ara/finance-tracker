import { ACTION_ERRORS } from "../constants/constants";
import { ActionErrorType, ActionResult, NormalizedActionError } from "./types";

type ErrorMapper = (payload: {
  message?: string;
  errors?: Record<string, string>;
}) => NormalizedActionError;

export const errorMappers: Record<ActionErrorType, ErrorMapper> = {
  [ACTION_ERRORS.VALIDATION]: (payload) => ({
    kind: "field",
    errors: payload.errors ?? {},
  }),

  [ACTION_ERRORS.CONFLICT]: (payload) => ({
    kind: "message",
    message: payload.message ?? "Conflict",
    type: ACTION_ERRORS.CONFLICT,
  }),

  [ACTION_ERRORS.AUTH]: (payload) => ({
    kind: "message",
    message: payload.message ?? "Unauthorized",
    type: ACTION_ERRORS.AUTH,
  }),

  [ACTION_ERRORS.SYSTEM]: (payload) => ({
    kind: "message",
    message: payload.message ?? "Something went wrong. Please try again later.",
    type: ACTION_ERRORS.SYSTEM,
  }),
};

export function resolveAction<T>(
  result: ActionResult<T>
):
  | { success: true; data?: T }
  | { success: false; error: NormalizedActionError } {
  if (result.ok) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    error: errorMappers[result.type](result),
  };
}
