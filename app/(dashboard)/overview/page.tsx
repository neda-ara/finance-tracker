import { PageTitle } from "@/components/common/page-title";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Expenses",
  description: "Track my expenses",
};

export default function OverviewPage() {
  return (
    <div className="relative flex flex-col justify-center pt-4 px-6 gap-y-6">
      <PageTitle
        heading="Overview"
        subheading="Get a snapshot of your finances in one glance."
      />
    </div>
  );
}
