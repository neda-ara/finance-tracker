"use client";

import { Attribution } from "@/lib/actions/types";
import { LINK_PATHS } from "@/lib/constants/constants";
import Image from "next/image";
import Link from "next/link";

export const AttributionCard = ({
  attribution,
  iconPath,
}: {
  attribution: Attribution;
  iconPath: string;
}) => {
  return (
    <div className="p-2.5 border rounded-lg flex flex-col gap-1.5 max-w-60">
      <div className="flex items-center gap-x-3">
        <Image
          alt={`${attribution.label}`}
          src={iconPath}
          height={100}
          width={100}
          className="h-10 w-10"
        />
        <p className="font-medium text-muted-foreground text-[13px] leading-4">
          <Link
            href={attribution.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-800 hover:underline font-semibold"
          >
            {attribution.label}
          </Link>{" "}
          icons by{" "}
          <span className="text-accent-foreground font-semibold">
            {attribution.author}
          </span>{" "}
          -{" "}
          <Link
            href={LINK_PATHS.FLATICON}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline"
          >
            Flaticon
          </Link>
        </p>
      </div>
    </div>
  );
};
