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

export type BaseFetchRequest = {
  page: number;
  pageSize: number;
};

export type FetchRequest<TFilters> = BaseFetchRequest & {
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

// ---------- Helper Types ----------

export type LabelValuePair = { label: string; value: string };

export type TotalByCurrency = { currency: string; total: number };

export type TrendDirection = "up" | "down" | "neutral";

export type TrendTone = "success" | "danger" | "warning" | "neutral";

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

// ---------- User ----------

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

// ---------- Budget ----------

export type Budget = {
  id: string;
  amount: number;
  currency: string;
  category: string;
  createdAt: Date;
  spent: number;
};

export type BudgetSummary = {
  total?: {
    currency: string;
    amount: number;
  };
  spent?: {
    currency: string;
    amount: number;
  };
  remaining?: {
    currency: string;
    amount: number;
  };
};

// ---------- Overview ----------

export type Interval =
  | "this_month"
  | "last_7_days"
  | "last_15_days"
  | "last_30_days";

export interface OverviewData {
  earnings: {
    currency?: string;
    amount: number;
    change: { amount: number | null; percentage: number | null };
  };
  expenses: {
    currency?: string;
    amount: number;
    change: { amount: number | null; percentage: number | null };
  };
  savings: {
    currency?: string;
    amount: number;
    change: { amount: number | null; percentage: number | null };
  };
  budget?: {
    currency?: string;
    total: number;
    spent: number;
    remaining: number;
    usedPercentage: number;
  };
}

export interface TopExpensesData {
  interval: Interval;
  total: {
    currency?: string;
    amount: number;
  };
  topCategories: {
    category: string;
    currency: string;
    amount: number;
    budget: number | null;
    budgetUsed: string | null;
    remaining: string | null;
    percentage: number;
  }[];
}

export interface ExpenseTrend {
  date: string;
  amount: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  currency: string;
  budget?: number;
}
