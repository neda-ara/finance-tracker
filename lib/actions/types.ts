import {
  ACTION_CONSTANTS,
  EXPENSE_CATEGORIES,
  SATISFACTION_RATINGS,
} from "../constants/constants";
import { ColumnDef } from "@tanstack/react-table";

// ---------- Server Action Types ----------

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

export type PaginatedResult<T> = {
  data: T[];
  pageNo: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
};

export type FetchRequest<TFilters> = {
  page: number;
  pageSize: number;
  filters: TFilters;
};

// ---------- UI Component Types ----------

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
  labelPlacement?: "outside" | "inside";
  disabled?: (date: Date) => boolean;
  customStyles?: { triggerButton?: string };
};

export type LabelValuePair = {
  label: string;
  value: string;
};

// ---------- Data Grid / Table ----------

export type RowAction<T> = {
  icon: React.ReactNode;
  label: string;
  onClick: (row: T) => void;
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
};

export type DataGridProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading: boolean;
  paginationParams: {
    pageNo: number;
    pageSize: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  customStyles?: { gridWrapperStyles?: string; tableContainerStyles?: string };
};

// ---------- User Domain ----------

export type User = {
  id: string;
  email: string;
  username: string;
};

// ---------- Expense ----------

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]["title"];

export type SatisfactionRating = keyof typeof SATISFACTION_RATINGS;

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

export type ExpenseFiltersType = {
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  minAmount: number;
  maxAmount: number;
  categories: string[];
  currencies: string[];
  paymentModes: string[];
  satisfactionRatings: string[];
};

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

// ---------- Earning ----------

export type Earning = {
  id: string;
  amount: number;
  currency: string;
  category: string;
  source: string | undefined;
  description: string | null;
  receivedDate: Date;
  createdAt: Date;
};

export type EarningsFiltersType = {
  searchQuery: string;
  startDate: Date | string;
  endDate: Date | string;
  minAmount: number;
  maxAmount: number;
  currencies: string[];
};

export type EarningSummary = {
  earnedThisMonth?: {
    currency: string;
    amount: number;
  };
  earnedPastYear?: {
    currency: string;
    amount: number;
  };
};
