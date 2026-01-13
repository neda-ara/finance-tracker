import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-full flex items-center justify-center px-24 py-8 bg-[linear-gradient(to_top,var(--color-primary),var(--color-secondary),var(--color-primary))]">
      <div className="h-full w-full flex items-center p-8 bg-(--color-tertiary) rounded-lg shadow-md">
        <div className="h-full w-1/2 bg-(--color-primary-soft) rounded-tl-lg rounded-bl-lg" />
        <div className="h-full w-1/2 bg-(--color-tertiary) rounded-tr-lg rounded-br-lg flex items-center justify-center pl-8">
          {children}
        </div>
      </div>
    </div>
  );
}
