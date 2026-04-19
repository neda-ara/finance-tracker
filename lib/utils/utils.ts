import { CURRENCIES } from "../constants/constants";

export const normalizeNumber = (value: string) => {
  const num = Number(value || 0);
  if (Number.isNaN(num)) {
    return 0;
  }
  return num.toFixed(2);
};

export const sanitizeNumberInput = (
  value: string,
  min = 0,
  max = 1_000_000,
  clampToOther?: number,
) => {
  const raw = value.replace(/\D/g, "");
  let num = Number(raw || 0);

  if (Number.isNaN(num)) {
    num = 0;
  }
  if (clampToOther !== undefined) {
    num = Math.min(num, clampToOther);
  }

  num = Math.max(min, Math.min(num, max));
  return num.toString();
};

export const formatDateForDisplay = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
};

export const isStringEqual = (str1: string, str2: string) => {
  if (!str1 || !str2) {
    return false;
  }
  return str1.toLowerCase() == str2.toLowerCase();
};

export const snakeCaseToTitleCase = (text: string) => {
  if (text) {
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  return "";
};

export const getCurrencySymbol = (currencyCode: string) => {
  if (currencyCode) {
    return CURRENCIES[currencyCode as keyof typeof CURRENCIES]?.symbol ?? "";
  }
  return "";
};
