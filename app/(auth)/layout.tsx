import { Logo } from "@/components/common/logo";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-full flex items-center justify-center px-24 py-8 bg-primary">
      <div className="h-full w-full flex items-center p-8 bg-white rounded-lg shadow-md">
        <div className="h-full w-1/2 bg-(--color-primary)/70 rounded-tl-lg rounded-bl-lg p-5">
          <Logo />
        </div>
        <div className="h-full w-1/2 bg-white rounded-tr-lg rounded-br-lg flex items-center justify-center pl-8">
          {children}
        </div>
      </div>
    </div>
  );
}
