import { LogoutButton } from "@/components/header/logout-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Expenses",
  description: "Track my expenses",
};

export default function ExpensesPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>MY EXPENSES</h1>
      <LogoutButton />
    </div>
  );
}
