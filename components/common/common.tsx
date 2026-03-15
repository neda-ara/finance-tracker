"use client";

import { MessageSquareWarning } from "lucide-react";
import { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/shadcn-utils";

type KpiCardProps = {
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  isLoading?: boolean;
  fallbackText?: string;
  customIcon?: ReactNode;
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
  customIcon,
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
        {imageSrc && imageAlt && (
          <Image
            alt={imageAlt}
            height={64}
            width={64}
            className="h-12 w-12 object-contain"
            src={imageSrc}
          />
        )}
        {customIcon}
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

export function CircularProgress({
  usedPercentage,
  remainingPercentage,
  size = 72,
  stroke = 8,
}: {
  usedPercentage: number; // the filled portion of the circle
  remainingPercentage: number; // the number to display inside
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const clampedUsed = Math.min(Math.max(usedPercentage, 0), 100);
  const offset = circumference - (clampedUsed / 100) * circumference;

  const gradientId = "progressGradient";

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId}>
            <stop offset="0%" stopColor="#22c55e" /> {/* green */}
            <stop offset="60%" stopColor="#eab308" /> {/* yellow */}
            <stop offset="100%" stopColor="#ef4444" /> {/* red */}
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="transparent"
        />

        {/* Foreground progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>

      {/* Remaining percentage in the center */}
      <span className="absolute text-xs font-semibold tabular-nums">
        {Math.round(remainingPercentage)}%
      </span>
    </div>
  );
}
