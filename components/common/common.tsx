"use client";

import { MessageSquareWarning } from "lucide-react";
import { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/shadcn-utils";

type KpiCardProps = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  isLoading?: boolean;
  fallbackText?: string;
  children?: ReactNode;
};

export const DeleteConfirmationBody = ({ entity }: { entity: string }) => {
  return (
    <div className="flex items-center gap-x-6">
      <MessageSquareWarning className="text-red-600 h-24 w-24" aria-hidden />
      <div>
        <p>
          Are you sure you want to delete this{" "}
          <span className="font-medium">{entity}</span>?
        </p>
      </div>
    </div>
  );
};

export const KpiCard = ({
  title,
  imageSrc,
  imageAlt,
  isLoading = false,
  fallbackText = "—",
  children,
}: KpiCardProps) => {
  return (
    <div className="card space-y-2">
      <div className="flex gap-x-5">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>

          {isLoading ? (
            <div className="bg-gray-100 w-full h-7 animate-pulse transition-all rounded-md" />
          ) : children ? (
            children
          ) : (
            <p className="h-7 max-w-40 flex items-center font-semibold text-[13px] text-muted-foreground tracking-tight leading-4">
              {fallbackText}
            </p>
          )}
        </div>

        <Image
          alt={imageAlt}
          height={64}
          width={64}
          className="h-12 w-12 object-contain"
          src={imageSrc}
        />
      </div>
    </div>
  );
};

export function GradientProgressBar({ percentage }: { percentage: number }) {
  const clamped = Math.min(percentage, 100);

  const gradient =
    percentage >= 100
      ? "from-red-500 to-red-600 !text-white"
      : percentage >= 85
        ? "from-amber-400 to-red-500"
        : percentage >= 60
          ? "from-green-400 via-yellow-400 to-amber-500"
          : "from-green-400 to-green-600";

  return (
    <div className="relative h-5 w-full rounded-sm bg-gray-200 overflow-hidden">
      <div
        className={`h-full bg-linear-to-r ${gradient} transition-all duration-500`}
        style={{ width: `${clamped}%` }}
      />

      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center text-[10px] font-semibold tabular-nums",
          percentage >= 85 && "text-white",
        )}
      >
        {percentage.toFixed(0)}%
      </span>
    </div>
  );
}
