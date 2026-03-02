import { Logo } from "@/components/common/logo";
import { ReactNode } from "react";

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
        </div>
        <div className="h-full w-1/2 bg-white rounded-tr-lg rounded-br-lg flex items-center justify-center pl-8">
          {children}
        </div>
      </div>
    </div>
  );
}
