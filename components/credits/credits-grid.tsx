"use client";

import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_ICONS_BASE_PATH,
} from "@/lib/constants/constants";
import { AttributionCard } from "./attribution-card";

export const CreditsGrid = () => {
  const getIconsList = () => {
    const expenseIcons = EXPENSE_CATEGORIES.map((expense) => ({
      ...expense,
      iconPath: `${EXPENSE_CATEGORY_ICONS_BASE_PATH}${expense.iconPath}`,
    }));
    return [...expenseIcons];
  };

  const ICONS_LIST = getIconsList();

  return (
    <div className="max-w-full min-w-full flex items-center flex-wrap mt-10 gap-2">
      {ICONS_LIST.map(
        (icon) =>
          icon.attribution && (
            <AttributionCard
              iconPath={icon.iconPath}
              attribution={icon.attribution}
            />
          ),
      )}
    </div>
  );
};
