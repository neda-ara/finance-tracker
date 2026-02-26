"use client";

import { Logo } from "./logo";

export const Sidebar = () => {
  return (
    <div className="w-60 h-full flex flex-col justify-between">
      <Logo />
      <div>Menu</div>
      <div>Profile</div>
    </div>
  );
};
