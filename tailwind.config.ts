import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        "primary-soft": "hsl(var(--primary-soft))",
        secondary: "hsl(var(--secondary))",
        tertiary: "hsl(var(--tertiary))",
      },
    },
  },
};

export default config;
