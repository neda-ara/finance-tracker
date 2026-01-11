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
