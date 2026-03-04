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
      <div className="absolute -top-2 left-88 opacity-85">
        <Image
          alt="cat"
          src={IMAGE_PATHS.EARNING_TITLE}
          height={120}
          width={120}
        />
      </div>
      <PageTitle
        heading="Earnings"
        subheading="Track what you earn. Strengthen what you keep."
      />
      {/* <ExpenseGrid /> */}
    </div>
  );
}
