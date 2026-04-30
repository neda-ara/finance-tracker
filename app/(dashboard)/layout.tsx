import { CreditsLink } from "@/components/common/credits-link";
import { getCurrentUser } from "@/lib/utils/auth";
import { ReactNode } from "react";
import { Sidebar } from "@/components/common/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userResp = await getCurrentUser();
  const loggedInUser = userResp.ok ? userResp.data : null;

  return (
    <div className="h-screen w-full flex items-center bg-primary py-2 pr-2">
      <Sidebar user={loggedInUser} />
      <div className="bg-white flex-1 min-h-full max-h-full rounded-xl shadow-md overflow-y-scroll scrollbar-hide">
        {children}
        <footer>
          <CreditsLink />
        </footer>
      </div>
    </div>
  );
}
