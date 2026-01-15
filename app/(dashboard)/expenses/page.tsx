import { ExpenseGrid } from "@/components/expenses/expense-grid";
import { PageTitle } from "@/components/common/page-title";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Expenses",
  description: "Track my expenses",
};

export default function ExpensesPage() {
  return (
    <div className="flex flex-col justify-center py-4 px-6 gap-y-6">
      <PageTitle
        heading="Expenses"
        subheading="Control the chaos, one expense at a time."
      />
      <ExpenseGrid />
    </div>
  );
}
