"use client";

import { MessageSquareWarning } from "lucide-react";
import { ReactNode } from "react";
import Image from "next/image";

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
            <p className="h-7 max-w-48 flex items-center font-semibold text-[13px] text-muted-foreground tracking-tight leading-4">
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
