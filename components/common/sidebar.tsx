"use client";

import { Baloo_Tamma_2 } from "next/font/google";
import { BarChart3, PiggyBank, Repeat, TrendingUp, Wallet } from "lucide-react";
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

  const iconsMap: Record<string, React.ElementType> = {
    [ROUTES.DASHBOARD.EXPENSES]: Wallet,
    [ROUTES.DASHBOARD.EARNINGS]: TrendingUp,
    [ROUTES.DASHBOARD.ANALYTICS]: BarChart3,
    [ROUTES.DASHBOARD.BUDGET]: PiggyBank,
    [ROUTES.DASHBOARD.AUTO_ENTRIES]: Repeat,
  };

  return (
    <div
      className={cn(
        "w-60 h-full flex flex-col justify-between py-5",
        bt2.className
      )}
    >
      <div>
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="flex justify-center w-full mt-28">
          <div className="flex flex-col gap-y-6">
            {Object.entries(ROUTES.DASHBOARD).map(([key, route]) => {
              const isActive = isStringEqual(pathName, key);
              const Icon = iconsMap[route];
              return (
                <Link key={key} href={route} className="relative group">
                  <div className="flex items-center gap-x-4">
                    {Icon && (
                      <Icon
                        className={cn(
                          "h-5 w-5 transition-colors",
                          isActive
                            ? "text-white"
                            : "text-white/60 group-hover:text-white"
                        )}
                      />
                    )}
                    <p
                      className={cn(
                        "capitalize text-xl leading-4 tracking-wide transition-all ease-in delay-10",
                        isActive
                          ? "text-white font-semibold"
                          : "text-white/60 group-hover:text-white font-medium"
                      )}
                    >
                      {snakeCaseToTitleCase(key).toLowerCase()}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex justify-center">Profile</div>
    </div>
  );
};
