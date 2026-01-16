import { ACTION_CONSTANTS, ACTION_ERRORS } from "../constants/constants";

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

export type ModalContent = {
  header: React.ReactNode;
  body: React.ReactNode;
};

export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogTrigger?: React.ReactNode;
  dialogTitle: string | React.ReactNode;
  dialogDescription?: string | React.ReactNode;
  dialogContent: React.ReactNode;
  showFooter?: boolean;
  footerContent?: React.ReactNode;
};

export type ActionConstant =
  (typeof ACTION_CONSTANTS)[keyof typeof ACTION_CONSTANTS];
