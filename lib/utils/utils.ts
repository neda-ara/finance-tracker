export const normalizeNumber = (value: string) => {
  const num = Number(value || 0);
  if (Number.isNaN(num)) {
    return 0;
  }
  return num.toFixed(2);
};

export const formatDateForDisplay = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
};
