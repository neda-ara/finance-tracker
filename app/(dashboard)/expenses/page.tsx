import { cn } from "@/lib/utils/shadcn-utils";
import { dashboardContainerStyles } from "@/lib/constants/constants";
import { ExpenseGrid } from "@/components/expenses/expense-grid";
import { PageTitle } from "@/components/common/page-title";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Expenses",
  description: "Track my expenses",
};

export default function ExpensesPage() {
  return (
    <div className={cn(dashboardContainerStyles)}>
      <PageTitle
        heading="Expenses"
        subheading="Control the chaos, one expense at a time."
      />
      <ExpenseGrid />
    </div>
  );
}
