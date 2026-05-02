"use client";

import { Attribution } from "@/lib/actions/types";
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
    <div className="px-4 py-2.5 border rounded-lg flex flex-col gap-1.5 max-w-60">
      <div className="flex items-center gap-x-2">
        <Image
          alt={`${attribution.label}`}
          src={iconPath}
          height={100}
          width={100}
          className="h-10 w-10"
        />
        <div className="flex flex-col">
          <p className="font-medium text-muted-foreground text-[13px] leading-4">
            <Link
              href={attribution.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {attribution.label}
            </Link>{" "}
            icon by{" "}
            <span className="text-accent-foreground font-semibold">
              {attribution.author}
            </span>{" "}
            – Flaticon
          </p>
        </div>
      </div>
    </div>
  );
};
