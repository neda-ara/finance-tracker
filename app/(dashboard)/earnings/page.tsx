import { EarningsGrid } from "@/components/earnings/earning-grid";
import { IMAGE_PATHS } from "@/lib/constants/constants";
import { PageTitle } from "@/components/common/page-title";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Earnings",
  description: "Track my earnings",
};

export default function EarningsPage() {
  return (
    <div className="relative flex flex-col justify-center pt-4 px-6 gap-y-6">
      <div className="absolute top-3.5 left-80 opacity-90">
        <Image
          alt="cat"
          src={IMAGE_PATHS.EARNING_TITLE}
          height={140}
          width={140}
        />
      </div>
      <PageTitle heading="Earnings" subheading="Every earning accounted for." />
      <EarningsGrid />
    </div>
  );
}
