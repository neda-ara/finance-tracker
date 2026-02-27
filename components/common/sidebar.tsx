"use client";

import { ROUTES } from "@/lib/constants/constants";
import { Logo } from "./logo";
import Link from "next/link";

export const Sidebar = () => {
  return (
    <div className="w-60 h-full flex flex-col justify-between py-4">
      <div className="flex justify-center">
        <Logo />
      </div>
      <div className="flex flex-col gap-y-2">
        {Object.entries(ROUTES.DASHBOARD).map(([key, route]) => (
          <Link key={key} href={route}>
            {key}
          </Link>
        ))}
      </div>
      <div>Profile</div>
    </div>
  );
};
