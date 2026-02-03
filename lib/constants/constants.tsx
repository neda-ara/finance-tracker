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

export const EXPENSE_CATEGORY_ICONS_BASE_PATH = "/images/expense-categories";

export const EXPENSE_CATEGORIES = [
  { title: "Food", iconPath: "/food.png" },
  { title: "Grocery", iconPath: "/grocery.png" },
  { title: "Transport", iconPath: "/transport.png" },
  { title: "Rent", iconPath: "/rent.png" },
  { title: "Vehicle", iconPath: "/vehicle.png" },
  { title: "Fuel", iconPath: "/fuel.png" },
  { title: "Education", iconPath: "/education.png" },
  { title: "Health", iconPath: "/health.png" },
  { title: "Electricity", iconPath: "/electricity.png" },
  { title: "Water", iconPath: "/water.png" },
  { title: "Gas", iconPath: "/gas.png" },
  { title: "Internet", iconPath: "/internet.png" },
  { title: "Phone", iconPath: "/phone.png" },
  { title: "Cable", iconPath: "/cable.png" },
  { title: "EMI", iconPath: "/emi.png" },
  { title: "Investment", iconPath: "/investment.png" },
  { title: "Insurance", iconPath: "/insurance.png" },
  { title: "Subscriptions", iconPath: "/subscriptions.png" },
  { title: "Pets", iconPath: "/pets.png" },
  { title: "Help", iconPath: "/help.png" },
  { title: "Repair", iconPath: "/repair.png" },
  { title: "Gym", iconPath: "/gym.png" },
  { title: "Salon", iconPath: "/salon.png" },
  { title: "Shopping", iconPath: "/shopping.png" },
  { title: "Vacation", iconPath: "/vacation.png" },
  { title: "Gifts", iconPath: "/gifts.png" },
  { title: "Entertainment", iconPath: "/entertainment.png" },
  { title: "Personal", iconPath: "/personal.png" },
  { title: "Family/Friends", iconPath: "/family-n-friends.png" },
  { title: "Charity", iconPath: "/charity.png" },
  { title: "Other", iconPath: "/other.png" },
] as const;

export const SATISFACTION_ICONS_BASE_PATH = "/images/satisfaction-emoticons";

export const SATISFACTION_RATINGS = {
  1: { title: "Absolutely not!", iconPath: "/cry.png", color: "text-red-600" },
  2: { title: "Not really", iconPath: "/sad.png", color: "text-red-400" },
  3: { title: "Maybe", iconPath: "/neutral.png", color: "text-amber-500" },
  4: { title: "Yeah", iconPath: "/smile.png", color: "text-blue-400" },
  5: {
    title: "Definitely!",
    iconPath: "/laughing.png",
    color: "text-green-500",
  },
} as const;

export const DEFAULT_VALUES = {
  PAGE_SIZE: 50,
};
