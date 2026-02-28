"use client";

import { Baloo_Tamma_2 } from "next/font/google";
import {
  BarChart3,
  Edit3,
  LogOut,
  PiggyBank,
  Repeat,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils/shadcn-utils";
import { IMAGE_PATHS, ROUTES } from "@/lib/constants/constants";
import { isStringEqual, snakeCaseToTitleCase } from "@/lib/utils/utils";
import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import { User } from "@/lib/actions/types";
import Image from "next/image";
import Link from "next/link";

const bt2 = Baloo_Tamma_2({
  weight: ["400"],
});

export const Sidebar = ({ user }: { user: User }) => {
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
                  {isActive && (
                    <div className="absolute -left-11.25 -top-2.25 bg-white h-8.5 w-1.75 rounded-r-sm" />
                  )}
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
      <div className="flex justify-center px-4 w-full">
        <div className="bg-white/60 w-full rounded-lg p-3 flex flex-col items-center gap-y-2.5">
          <div className="flex items-center gap-x-1.5">
            <div className="flex justify-center items-center rounded-full w-10 aspect-square overflow-hidden">
              <Image
                alt="user"
                src={IMAGE_PATHS.PLACEHOLDER_AVATAR}
                height={100}
                width={100}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex flex-col justify-center h-full">
              <p className="font-medium leading-none">{user.username}</p>
              <p className="text-xs leading-none max-w-32 overflow-hidden text-ellipsis">
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-x-1 text-white">
            <div className="flex items-center gap-x-1.5 px-2 py-1 bg-red-700  rounded-full">
              <LogOut className="h-3.5 w-3.5" />
              <span className="text-xs leading-none mt-0.75">Logout</span>
            </div>
            <div className="flex items-center gap-x-1.5 px-2 py-1 bg-black/80 rounded-full">
              <Edit3 className="h-3.5 w-3.5" />
              <span className="text-xs leading-none mt-0.75">Edit Profile</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
