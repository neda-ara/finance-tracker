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

export const EXPENSE_CATEGORY_BASE_PATH = "/images/expense-categories";

export const EXPENSE_CATEGORIES = [
  { title: "Food", iconPath: "/food.png" },
  { title: "Grocery", iconPath: "/grocery.png" },
  { title: "Transport", iconPath: "/transport.png" },
  { title: "Home", iconPath: "/home.png" },
  { title: "Vehicle", iconPath: "/vehicle.png" },
  { title: "Education", iconPath: "/education.png" },
  { title: "Health", iconPath: "/health.png" },
  { title: "Electricity", iconPath: "/electricity.png" },
  { title: "Water", iconPath: "/water.png" },
  { title: "Gas", iconPath: "/gas.png" },
  { title: "Internet", iconPath: "/internet.png" },
  { title: "Phone", iconPath: "/phone.png" },
  { title: "Cable", iconPath: "/cable.png" },
  { title: "Pets", iconPath: "/pets.png" },
  { title: "Gym", iconPath: "/gym.png" },
  { title: "Salon", iconPath: "/salon.png" },
  { title: "Shopping", iconPath: "/shopping.png" },
  { title: "Vacation", iconPath: "/vacation.png" },
  { title: "Gifts", iconPath: "/gifts.png" },
  { title: "Entertainment", iconPath: "/entertainment.png" },
  { title: "Investment", iconPath: "/investment.png" },
  { title: "Insurance", iconPath: "/insurance.png" },
  { title: "Subscriptions", iconPath: "/subscriptions.png" },
  { title: "Personal", iconPath: "/personal.png" },
  { title: "Family/Friends", iconPath: "/family-n-friends.png" },
  { title: "Charity", iconPath: "/charity.png" },
  { title: "Other", iconPath: "/other.png" },
] as const;

export const SATISFACTION_RATING_LABELS = {
  1: "Absolutely not!",
  2: "Not really",
  3: "Maybe",
  4: "Yeah",
  5: "Definitely!",
} as const;

export const DEFAULT_VALUES = {
  PAGE_SIZE: 50,
};
