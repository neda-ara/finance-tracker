export const normalizeNumber = (value: string) => {
  // remove leading zeros
  const num = Number(value || 0);

  if (Number.isNaN(num)) {
    return 0;
  }

  return num.toFixed(2);
};
