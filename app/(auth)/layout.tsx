import { Baloo_Tamma_2 } from "next/font/google";
import { Logo } from "@/components/common/logo";
import { ReactNode } from "react";
import { cn } from "@/lib/utils/shadcn-utils";
import { Quote } from "@/components/common/svg/quote";
import Image from "next/image";
import { IMAGE_PATHS } from "@/lib/constants/constants";

const bt2 = Baloo_Tamma_2({
  weight: ["400"],
});

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-full flex items-center justify-center px-24 py-8 bg-primary">
      <div className="h-full w-full flex items-center p-8 bg-white rounded-lg shadow-md">
        <div className="h-full w-1/2 relative p-5 overflow-hidden rounded-tl-lg rounded-tr-[65px]">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 800 600"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="cardGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff7a7d" />
                <stop offset="100%" stopColor="#ff8c8f" />
              </linearGradient>
            </defs>
            <path
              d="M0,600 C150,350 300,500 410,340 C480,170 720,320 796,100 C810,0 900,0 800,0 L800,0 L0,0 Z"
              fill="url(#cardGradient)"
            />
          </svg>
          <div className="relative z-10">
            <Logo />
          </div>
          <div className="absolute top-1/4 left-1/10 w-full z-10 flex px-6">
            <div
              className={cn(
                "text-white w-55 max-w-full flex flex-col justify-between",
                bt2.className
              )}
            >
              <Quote color="#ffffff80" className="h-9 mb-2" />
              <p className="font-medium text-lg leading-5.5">
                You must gain control over your money or the lack of it will
                forever control you.
              </p>
              <div className="w-16 h-0.5 mt-2 bg-white/60 self-center" />
              <p className="self-center mt-2 uppercase">Dave Ramsey</p>
            </div>
          </div>
          <Image
            alt="finance"
            src={IMAGE_PATHS.AUTH_IMG}
            height={500}
            width={500}
            className="absolute bottom-8 right-12 h-60 w-60"
          />
        </div>
        <div className="h-full w-1/2 bg-white rounded-tr-lg rounded-br-lg flex items-center justify-center pl-8">
          {children}
        </div>
      </div>
    </div>
  );
}
