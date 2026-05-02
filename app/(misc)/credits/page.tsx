import { PageTitle } from "@/components/common/page-title";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credits",
  description: "View detailed credits",
};

export default function CreditsPage() {
  return (
    <div className="flex flex-col justify-between px-6 pt-4">
      <PageTitle
        heading="Credits"
        subheading="Acknowledging the creators behind the icons used in this project."
      />
    </div>
  );
}
