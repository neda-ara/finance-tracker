import { getCurrentUser } from "@/lib/utils/auth";
import { ReactNode } from "react";
import { Sidebar } from "@/components/common/sidebar";
import { cn } from "@/lib/utils/shadcn-utils";

export default async function MiscLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userResp = await getCurrentUser();
  const loggedInUser = userResp.ok ? userResp.data : null;

  return (
    <div
      className={cn(
        "h-screen w-full flex items-center bg-primary py-2 ",
        loggedInUser ? "pr-2" : "px-2",
      )}
    >
      {loggedInUser && <Sidebar user={loggedInUser} />}
      <div className="bg-white flex-1 min-h-full max-h-full rounded-xl shadow-md overflow-y-scroll scrollbar-hide">
        {children}
      </div>
    </div>
  );
}
