"use client";

import { MessageSquareWarning } from "lucide-react";

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
