import { Overview } from "@/components/overview/overview";
import { PageTitle } from "@/components/common/page-title";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview",
  description: "My Finances Overview",
};

export default function OverviewPage() {
  return (
    <div className="relative flex flex-col py-4 px-6 gap-y-6 min-h-[calc(100vh-16px)] max-h-[calc(100vh-16px)] overflow-hidden">
      <PageTitle
        heading="Overview"
        subheading="Get a snapshot of your finances in one glance."
      />
      <Overview />
    </div>
  );
}
