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

export const VALIDATION = {
  MAX_AMOUNT_LIMIT: 999999.99,
  MAX_DESCRIPTION_LENGTH: 200,
};

export const CURRENCIES = {
  USD: { code: "USD", name: "US Dollar", symbol: "$" },
  EUR: { code: "EUR", name: "Euro", symbol: "€" },
  GBP: { code: "GBP", name: "British Pound", symbol: "£" },
  JPY: { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  CNY: { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  INR: { code: "INR", name: "Indian Rupee", symbol: "₹" },
  AED: { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  CHF: { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  MXN: { code: "MXN", name: "Mexican Peso", symbol: "$" },
} as const;

export const AMOUNT_INPUT_REGEX = /^\d*\.?\d{0,2}$/;
