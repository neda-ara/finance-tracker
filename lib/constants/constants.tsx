export const ROUTES = {
  LANDING: "/",
  AUTH: {
    LOGIN: "/login",
    SIGNUP: "/signup",
  },
  DASHBOARD: {
    OVERVIEW: "/overview",
    EXPENSES: "/expenses",
    EARNINGS: "/earnings",
    BUDGETS: "/budgets",
    //   ANALYTICS: "/analytics",
    //   AUTO_ENTRIES: "/auto-entries",
  },
  PROFILE: "/profile",
  SETTINGS: "/settings",
  CREDITS: "/credits",
};

export const LINK_PATHS = {
  FLATICON: "https://www.flaticon.com/",
};

export const ENV_PRODUCTION = "production";

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
  EXPENSE: {
    MAX_AMOUNT_LIMIT: 9999999.99,
  },
  EARNING: {
    MAX_AMOUNT_LIMIT: 99999999.99,
  },
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
  {
    title: "Food",
    iconPath: "/food.png",
    attribution: {
      label: "Fast food",
      url: "https://www.flaticon.com/free-icon/fast-food_9718703",
      author: "Viktor Turchyn",
    },
  },
  {
    title: "Grocery",
    iconPath: "/grocery.png",
    attribution: {
      label: "Goods",
      url: "https://www.flaticon.com/free-icon/groceries_1682323",
      author: "smalllikeart",
    },
  },
  {
    title: "Transport",
    iconPath: "/transport.png",
    attribution: {
      label: "Transportation",
      url: "https://www.flaticon.com/free-icon/transportation_18146600",
      author: "kmg design",
    },
  },
  {
    title: "Rent",
    iconPath: "/rent.png",
    attribution: {
      label: "Rent",
      url: "https://www.flaticon.com/free-icon/house_602220",
      author: "Freepik",
    },
  },
  {
    title: "Vehicle",
    iconPath: "/vehicle.png",
    attribution: {
      label: "Car",
      url: "https://www.flaticon.com/free-icon/car_171239",
      author: "Freepik",
    },
  },
  {
    title: "Fuel",
    iconPath: "/fuel.png",
    attribution: {
      label: "Petrol Pump",
      url: "https://www.flaticon.com/free-icon/petrol-pump_9154309",
      author: "Freepik",
    },
  },
  {
    title: "Education",
    iconPath: "/education.png",
    attribution: {
      label: "University",
      url: "https://www.flaticon.com/free-icon/graduation_2997322",
      author: "justicon",
    },
  },
  {
    title: "Health",
    iconPath: "/health.png",
    attribution: {
      label: "Health",
      url: "https://www.flaticon.com/free-icon/healthcare_2382461",
      author: "Freepik",
    },
  },
  {
    title: "Electricity",
    iconPath: "/electricity.png",
    attribution: {
      label: "Electricity",
      url: "https://www.flaticon.com/free-icon/electrical-energy_4514764",
      author: "Flat Icons",
    },
  },
  {
    title: "Water",
    iconPath: "/water.png",
    attribution: {
      label: "Faucet",
      url: "https://www.flaticon.com/free-icon/faucet_1683015",
      author: "smalllikeart",
    },
  },
  {
    title: "Gas",
    iconPath: "/gas.png",
    attribution: {
      label: "Gas Cylinder",
      url: "https://www.flaticon.com/free-icon/gas-cylinder_9747073",
      author: "Robert Angle",
    },
  },
  {
    title: "Internet",
    iconPath: "/internet.png",
    attribution: {
      label: "Internet",
      url: "https://www.flaticon.com/free-icon/internet_4253160",
      author: "Freepik",
    },
  },
  {
    title: "Phone",
    iconPath: "/phone.png",
    attribution: {
      label: "Phone",
      url: "https://www.flaticon.com/free-icon/telephone-call_827899",
      author: "Freepik",
    },
  },
  {
    title: "Cable",
    iconPath: "/cable.png",
    attribution: {
      label: "Tv",
      url: "https://www.flaticon.com/free-icon/technology_11420072",
      author: "Muhazdinata",
    },
  },
  {
    title: "EMI",
    iconPath: "/emi.png",
    attribution: {
      label: "Emi",
      url: "https://www.flaticon.com/free-icon/money_15233228",
      author: "SBTS2018",
    },
  },
  {
    title: "Investment",
    iconPath: "/investment.png",
    attribution: {
      label: "Business and finance",
      url: "https://www.flaticon.com/free-icon/investment_12129079",
      author: "Flowicon",
    },
  },
  {
    title: "Insurance",
    iconPath: "/insurance.png",
    attribution: {
      label: "Health insurance",
      url: "https://www.flaticon.com/free-icon/health-insurance_2209673",
      author: "Freepik",
    },
  },
  {
    title: "Subscriptions",
    iconPath: "/subscriptions.png",
    attribution: {
      label: "Subscription",
      url: "https://www.flaticon.com/free-icon/subscription-active_18890024",
      author: "Eklip Studio",
    },
  },
  {
    title: "Pets",
    iconPath: "/pets.png",
    attribution: {
      label: "Animal shelter",
      url: "https://www.flaticon.com/free-icon/animal-shelter_5871573",
      author: "Freepik",
    },
  },
  {
    title: "Help",
    iconPath: "/help.png",
    attribution: {
      label: "Maid",
      url: "https://www.flaticon.com/free-icon/cleaner_1886780",
      author: "max.icons",
    },
  },
  {
    title: "Repair",
    iconPath: "/repair.png",
    attribution: {
      label: "Maintenance",
      url: "https://www.flaticon.com/free-icon/mechanic_11133672",
      author: "kliwir art",
    },
  },
  {
    title: "Gym",
    iconPath: "/gym.png",
    attribution: {
      label: "Gym",
      url: "https://www.flaticon.com/free-icon/treadmill_2382646",
      author: "Freepik",
    },
  },
  {
    title: "Salon",
    iconPath: "/salon.png",
    attribution: {
      label: "Salon",
      url: "https://www.flaticon.com/free-icon/salon_12525097",
      author: "Freepik",
    },
  },
  {
    title: "Shopping",
    iconPath: "/shopping.png",
    attribution: {
      label: "Shopping bag",
      url: "https://www.flaticon.com/free-icon/shopping-bag_3779800",
      author: "BZZRINCANTATION",
    },
  },
  {
    title: "Vacation",
    iconPath: "/vacation.png",
    attribution: {
      label: "Summer",
      url: "https://www.flaticon.com/free-icon/vacations_2664650",
      author: "Freepik",
    },
  },
  {
    title: "Gifts",
    iconPath: "/gifts.png",
    attribution: {
      label: "Gift",
      url: "https://www.flaticon.com/free-icon/gift_3546959",
      author: "Freepik",
    },
  },
  {
    title: "Entertainment",
    iconPath: "/entertainment.png",
    attribution: {
      label: "Amusement park",
      url: "https://www.flaticon.com/free-icon/theme-park_14023195",
      author: "Freepik",
    },
  },
  {
    title: "Personal",
    iconPath: "/personal.png",
    attribution: {
      label: "Self esteem",
      url: "https://www.flaticon.com/free-icon/love-yourself_6911538",
      author: "Freepik",
    },
  },
  {
    title: "Family/Friends",
    iconPath: "/family-n-friends.png",
    attribution: {
      label: "Target",
      url: "https://www.flaticon.com/free-icon/target_1605350",
      author: "Freepik",
    },
  },
  {
    title: "Charity",
    iconPath: "/charity.png",
    attribution: {
      label: "Charity",
      url: "https://www.flaticon.com/free-icon/donation_10880437",
      author: "Freepik",
    },
  },
  {
    title: "Other",
    iconPath: "/other.png",
    attribution: {
      label: "View more",
      url: "https://www.flaticon.com/free-icon/more_15665905",
      author: "Pixa_icons",
    },
  },
] as const;

export const SATISFACTION_ICONS_BASE_PATH = "/images/satisfaction-emoticons";

export const SATISFACTION_RATINGS = {
  1: {
    title: "Absolutely not!",
    iconPath: "/cry.png",
    color: "text-red-600",
    attribution: {
      label: "shiba-inu",
      url: "https://www.flaticon.com/free-icon/cry_2171949",
      author: "AomAm",
    },
  },
  2: {
    title: "Not really",
    iconPath: "/sad.png",
    color: "text-red-400",
    attribution: {
      label: "shiba-inu",
      url: "https://www.flaticon.com/free-icon/nervous_2172062",
      author: "AomAm",
    },
  },
  3: {
    title: "Maybe",
    iconPath: "/neutral.png",
    color: "text-amber-500",
    attribution: {
      label: "shiba-inu",
      url: "https://www.flaticon.com/free-icon/neutral_2172069",
      author: "AomAm",
    },
  },
  4: {
    title: "Yeah",
    iconPath: "/smile.png",
    color: "text-blue-400",
    attribution: {
      label: "shiba-inu",
      url: "https://www.flaticon.com/free-icon/laughing_2172021",
      author: "AomAm",
    },
  },
  5: {
    title: "Definitely!",
    iconPath: "/laughing.png",
    color: "text-green-500",
    attribution: {
      label: "shiba-inu",
      url: "https://www.flaticon.com/free-icon/happy_2171981",
      author: "AomAm",
    },
  },
} as const;

export const DEFAULT_VALUES = {
  PAGE_SIZE: 50,
};

export const PAGE_SIZE_OPTONS = [10, 25, 50, 75, 100, 250];

export const IMAGE_PATHS = {
  TODAY: "/images/icons/today.png",
  YEAR: "/images/icons/year.png",
  MONTH: "/images/icons/month.png",
  "30DAYS": "/images/icons/30-days.png",
  NO_RESULTS: "/images/icons/no-results.png",
  PLACEHOLDER_AVATAR: "/images/avatars/ducka-lisa.jpg",
  AUTH: "/images/creative/finance.png",
  WALLET: "/images/icons/wallet.png",
  GOOGLE: "/logos/google.png",
};

export const IMAGE_ATTRIBUTIONS = {
  TODAY: {
    label: "Today",
    url: "https://www.flaticon.com/free-icon/calendar_12113063",
    author: "redempticon",
  },
  YEAR: {
    label: "Calendar",
    url: "https://www.flaticon.com/free-icon/calendar_10755587",
    author: "Gorbachev",
  },
  MONTH: {
    label: "Month",
    url: "https://www.flaticon.com/free-icon/month_10755493",
    author: "Flat Icons",
  },
  "30DAYS": {
    label: "Month",
    url: "https://www.flaticon.com/free-icon/30-days_6381435",
    author: "Freepik",
  },
  NO_RESULTS: {
    label: "No-results",
    url: "https://www.flaticon.com/free-icon/no-results_6195678",
    author: "Freepik",
  },
  AUTH: {
    label: "Accounting",
    url: "https://www.flaticon.com/free-icon/accounting_7892621",
    author: "Mehwish",
  },
  WALLET: {
    label: "Expense",
    url: "https://www.flaticon.com/free-icon/expenses_5501371",
    author: "surang",
  },
};

export const INTERVALS = [
  { label: "This Month", value: "this_month" },
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "Last 15 Days", value: "last_15_days" },
  { label: "Last 30 Days", value: "last_30_days" },
];

const COLORS = {
  PRIMARY: {
    SUCCESS: "#10b981",
    ERROR: "#ef4444",
  },
  SECONDARY: {
    SUCCESS: "#ecfdf5",
    ERROR: "#fef2f2",
  },
};

export const toastStyles = {
  style: {
    borderRadius: "8px",
    borderWidth: "1.75px",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
  },
  success: {
    style: {
      background: COLORS.SECONDARY.SUCCESS,
      color: COLORS.PRIMARY.SUCCESS,
      fontWeight: 500,
      border: `1.75px solid ${COLORS.PRIMARY.SUCCESS}`,
    },
    iconTheme: {
      primary: COLORS.PRIMARY.SUCCESS,
      secondary: COLORS.SECONDARY.SUCCESS,
    },
  },
  error: {
    style: {
      background: COLORS.SECONDARY.ERROR,
      color: COLORS.PRIMARY.ERROR,
      fontWeight: 500,
      border: `1.75px solid ${COLORS.PRIMARY.ERROR}`,
    },
    iconTheme: {
      primary: COLORS.PRIMARY.ERROR,
      secondary: COLORS.SECONDARY.ERROR,
    },
  },
};

export const dashboardContainerStyles =
  "min-h-[calc(100vh-48px)] max-h-[calc(100vh-48px)] relative flex flex-col pt-4 px-6 gap-y-6 overflow-hidden";
