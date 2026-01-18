export const ROUTES = {
  AUTH: {
    LOGIN: "/login",
    SIGNUP: "/signup",
  },
  DASHBOARD: {
    EXPENSES: "/expenses",
  },
};

export const ACTION_ERRORS = {
  VALIDATION: "validation",
  CONFLICT: "conflict",
  AUTH: "auth",
  SYSTEM: "system",
} as const;

export const ACTION_CONSTANTS = {
  ADD: "Add",
  DELETE: "Delete",
  EDIT: "Edit",
  VIEW: "View",
};

export const AMOUNT_INPUT_REGEX = /^\d*\.?\d{0,2}$/;

export const VALIDATION = {
  MAX_AMOUNT_LIMIT: 9999999.99,
  MAX_DESCRIPTION_LENGTH: 100,
};

export const CURRENCIES = {
  AED: { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  AUD: { code: "AUD", name: "Australian Dollar", symbol: "$" },
  CAD: { code: "CAD", name: "Canadian Dollar", symbol: "$" },
  CHF: { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  CNY: { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  EUR: { code: "EUR", name: "Euro", symbol: "€" },
  GBP: { code: "GBP", name: "British Pound", symbol: "£" },
  INR: { code: "INR", name: "Indian Rupee", symbol: "₹" },
  JPY: { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  MXN: { code: "MXN", name: "Mexican Peso", symbol: "$" },
  SGD: { code: "SGD", name: "Singapore Dollar", symbol: "$" },
  USD: { code: "USD", name: "US Dollar", symbol: "$" },
} as const;

export const PAYMENT_MODE = [
  { label: "Online", value: "online" },
  { label: "Cash", value: "cash" },
];

export const SATISFACTION_RATING_LABELS = {
  1: "Absolutely not",
  2: "Not really",
  3: "Not sure",
  4: "Yeah",
  5: "Hell yes",
} as const;
