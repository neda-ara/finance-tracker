"use client";

import { cn } from "@/lib/utils/shadcn-utils";
import { LINK_PATHS, ROUTES } from "@/lib/constants/constants";
import Link from "next/link";

type CustomStyles = {
  wrapper?: string;
};

export const CreditsLink = ({
  customStyles,
}: {
  customStyles?: CustomStyles;
}) => {
  return (
    <div className={cn("px-6 py-2", customStyles?.wrapper)}>
      <p className="text-[11px]">
        Icons by various authors from{" "}
        <Link
          className="text-emerald-600 font-medium hover:underline"
          href={LINK_PATHS.FLATICON}
          rel="noopener noreferrer"
          target="_blank"
        >
          Flaticon
        </Link>
        <span className="mx-1">•</span>
        <Link
          className="text-blue-500 font-medium hover:underline"
          href={ROUTES.CREDITS}
          rel="noopener noreferrer"
          target="_blank"
        >
          View full credits
        </Link>
      </p>
    </div>
  );
};
