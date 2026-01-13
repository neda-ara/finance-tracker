"use client";

import { logout } from "@/actions/auth/logout";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-red-500 hover:underline"
    >
      Log out
    </button>
  );
}
