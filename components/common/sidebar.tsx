"use client";

import { Baloo_Tamma_2 } from "next/font/google";
import { cn } from "@/lib/utils/shadcn-utils";
import { isStringEqual, snakeCaseToTitleCase } from "@/lib/utils/utils";
import { Logo } from "./logo";
import { ROUTES } from "@/lib/constants/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";

const bt2 = Baloo_Tamma_2({
  weight: ["400"],
});

export const Sidebar = () => {
  const pathName = usePathname().slice(1);

  return (
    <div
      className={cn(
        "w-60 h-full flex flex-col justify-between py-5",
        bt2.className
      )}
    >
      <div className="flex justify-center">
        <Logo />
      </div>
      <div className="flex justify-center w-full">
        <div className="flex flex-col gap-y-4">
          {Object.entries(ROUTES.DASHBOARD).map(([key, route]) => {
            const isActive = isStringEqual(pathName, key);
            return (
              <Link key={key} href={route} className="relative group">
                <p
                  className={cn(
                    "capitalize text-xl tracking-wide transition-all ease-in delay-10",
                    isActive
                      ? "text-white font-semibold"
                      : "text-white/60 group-hover:text-white font-medium"
                  )}
                >
                  {snakeCaseToTitleCase(key).toLowerCase()}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center">Profile</div>
    </div>
  );
};
