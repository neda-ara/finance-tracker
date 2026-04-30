"use client";

import { ROUTES } from "@/lib/constants/constants";
import Link from "next/link";

export const CreditsLink = () => {
  return (
    <div className="px-6 py-2">
      <p className="text-[11px]">
        Icons by various authors from{" "}
        <Link
          href={"https://www.flaticon.com/"}
          className="text-emerald-600 font-medium"
        >
          Flaticon
        </Link>{" "}
        •{" "}
        <Link href={ROUTES.CREDITS} className="text-blue-500 font-medium">
          View full credits
        </Link>
      </p>
    </div>
  );
};
