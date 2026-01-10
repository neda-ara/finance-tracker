import { ACTION_ERRORS } from "../constants/constants";

export type ActionErrorType =
  (typeof ACTION_ERRORS)[keyof typeof ACTION_ERRORS];

export type ActionResult<T = void> =
  | { ok: true; data?: T }
  | {
      ok: false;
      type: ActionErrorType;
      message?: string;
      errors?: Record<string, string>;
    };

export type NormalizedActionError =
  | {
      kind: "field";
      errors: Record<string, string>;
    }
  | {
      kind: "message";
      message: string;
      type: ActionErrorType;
    };
