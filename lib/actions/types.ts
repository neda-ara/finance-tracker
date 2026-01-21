import {
  ACTION_CONSTANTS,
  ACTION_ERRORS,
  EXPENSE_CATEGORIES,
  SATISFACTION_RATING_LABELS,
} from "../constants/constants";

export type ActionConstant =
  (typeof ACTION_CONSTANTS)[keyof typeof ACTION_CONSTANTS];

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
  showCloseButton?: boolean;
  customStyles?: { dialogContent?: string };
};

export type DatePickerProps = {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  label?: string;
  disabled?: (date: Date) => boolean;
};

export type LabelValuePair = {
  label: string;
  value: string;
};

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]["title"];

export type SatisfactionRating = keyof typeof SATISFACTION_RATING_LABELS;

export type PaginatedResult<T> = {
  data: T[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
};

export type Expense = {
  id: string;
  amount: number;
  currency: string;
  category: string;
  paymentMode: string;
  description: string | null;
  satisfactionRating: number;
  expenseDate: Date;
  createdAt: Date;
};
