import { EarningsGrid } from "@/components/earnings/earning-grid";
import { PageTitle } from "@/components/common/page-title";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Earnings",
  description: "Track my earnings",
};

export default function EarningsPage() {
  return (
    <div className="relative flex flex-col justify-center pt-4 px-6 gap-y-6">
      <PageTitle heading="Earnings" subheading="Every earning accounted for." />
      <EarningsGrid />
    </div>
  );
}
