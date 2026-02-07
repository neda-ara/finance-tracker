import { ColumnDef } from "@tanstack/react-table";
import {
  ACTION_CONSTANTS,
  EXPENSE_CATEGORIES,
  SATISFACTION_RATINGS,
} from "../constants/constants";

export type ActionConstant =
  (typeof ACTION_CONSTANTS)[keyof typeof ACTION_CONSTANTS];

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: {
        message?: string;
        fieldErrors?: Record<string, string>;
      };
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

export type SatisfactionRating = keyof typeof SATISFACTION_RATINGS;

export type ExpenseSummary = {
  spentThisMonth?: {
    currency: string;
    amount: number;
  };
  spentLast30Days?: {
    currency: string;
    amount: number;
  };
};

export type PaginatedResult<T, S = unknown> = {
  data: T[];
  pageNo: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  summary?: S;
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

export type GetExpensesRequest = {
  page: number;
  pageSize: number;
  searchKey?: string;
  filters?: Record<string, unknown>;
};

export type DataGridProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
};

export type RowAction<T> = {
  icon: React.ReactNode;
  label: string;
  onClick: (row: T) => void;
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
};
