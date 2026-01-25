export const ROUTES = {
  AUTH: {
    LOGIN: "/login",
    SIGNUP: "/signup",
  },
  DASHBOARD: {
    EXPENSES: "/expenses",
  },
};

export const UNAUTHORIZED_ERR_MSG =
  "You are not authorized to perform this operation.";

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

export const EXPENSE_CATEGORY_BASE_PATH = "/images/icons/expense-categories";

export const EXPENSE_CATEGORIES = [
  { title: "Food", iconPath: "/food.png" },
  { title: "Grocery", iconPath: "/grocery.png" },
  { title: "Transport", iconPath: "/transport.png" },
  { title: "Rent", iconPath: <></> },
  { title: "Cleaning", iconPath: <></> },
  { title: "Repair", iconPath: <></> },
  { title: "Vehicle", iconPath: <></> },
  { title: "Education", iconPath: <></> },
  { title: "Health", iconPath: <></> },
  { title: "Electricity", iconPath: <></> },
  { title: "Water", iconPath: <></> },
  { title: "Gas", iconPath: <></> },
  { title: "Internet", iconPath: <></> },
  { title: "Phone", iconPath: <></> },
  { title: "Cable", iconPath: <></> },
  { title: "Pets", iconPath: <></> },
  { title: "Gym", iconPath: <></> },
  { title: "Salon", iconPath: <></> },
  { title: "Shopping", iconPath: <></> },
  { title: "Vacation", iconPath: <></> },
  { title: "Gifts", iconPath: <></> },
  { title: "Entertainment", iconPath: <></> },
  { title: "Investment", iconPath: <></> },
  { title: "Insurance", iconPath: <></> },
  { title: "Subscriptions", iconPath: <></> },
  { title: "Personal", iconPath: <></> },
  { title: "Other", iconPath: <></> },
] as const;

export const SATISFACTION_RATING_LABELS = {
  1: "Absolutely not!",
  2: "Not really",
  3: "Maybe",
  4: "Yeah",
  5: "Definitely!",
} as const;
