import { Sidebar } from "@/components/common/sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-full flex items-center bg-(--color-cta) py-2 pr-2">
      <Sidebar />
      <div className="bg-(--color-tertiary) flex-1 min-h-full rounded-xl shadow-md">
        {children}
      </div>
    </div>
  );
}
