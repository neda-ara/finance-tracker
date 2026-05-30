"use client";

import { AttributionCard } from "./attribution-card";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_ICONS_BASE_PATH,
  IMAGE_ATTRIBUTIONS,
  IMAGE_PATHS,
  SATISFACTION_ICONS_BASE_PATH,
  SATISFACTION_RATINGS,
} from "@/lib/constants/constants";

export const CreditsGrid = () => {
  const getIconsList = () => {
    const expenseIcons = EXPENSE_CATEGORIES.map((expense) => ({
      ...expense,
      iconPath: `${EXPENSE_CATEGORY_ICONS_BASE_PATH}${expense.iconPath}`,
    }));

    const satisfactionRatingIcons = Object.values(SATISFACTION_RATINGS).map(
      (satisfactionRating) => ({
        ...satisfactionRating,
        iconPath: `${SATISFACTION_ICONS_BASE_PATH}${satisfactionRating.iconPath}`,
      }),
    );

    const generalIcons = Object.entries(IMAGE_ATTRIBUTIONS).map(
      ([key, attribution]) => ({
        title: key,
        iconPath: IMAGE_PATHS[key as keyof typeof IMAGE_PATHS],
        attribution,
      }),
    );

    return [...generalIcons, ...expenseIcons, ...satisfactionRatingIcons];
  };

  const ICONS_LIST = getIconsList();

  return (
    <div className="max-w-full min-w-full max-h-[calc(100vh-150px)] overflow-y-scroll custom-scrollbar grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 3xl:grid-cols-7 mt-10 gap-2 pr-2">
      {ICONS_LIST.map(
        (icon, idx) =>
          icon.attribution && (
            <AttributionCard
              key={`${idx}-${icon.title}`}
              iconPath={icon.iconPath}
              attribution={icon.attribution}
            />
          ),
      )}
    </div>
  );
};
