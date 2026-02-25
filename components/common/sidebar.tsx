"use client";

import { Logo } from "./logo";

export const Sidebar = () => {
  return (
    <div className="bg- w-60 h-full">
      <Logo />
      <div>MENU ITEMS</div>
      <div>Profile & Logout</div>
    </div>
  );
};
