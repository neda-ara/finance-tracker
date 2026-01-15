"use client";

import { Vollkorn } from "next/font/google";
import { JSX } from "react";

const volkorn = Vollkorn({
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const PageTitle = ({
  icon,
  heading,
  subheading,
}: {
  icon?: JSX.Element;
  heading: string;
  subheading?: string;
}) => {
  return (
    <div>
      <h1
        className={`${volkorn.className} flex items-center font-bold text-4xl leading-tight text-(--color-cta) [text-shadow:1.5px_1.5px_0_var(--color-primary)]`}
      >
        {icon}
        {heading}
      </h1>
      {subheading && (
        <h3
          className={`${volkorn.className} text-lg font-medium text-(--color-subtext) leading-tight [text-shadow:1px_1px_0_rgba(0,0,0,0.1)]`}
        >
          {subheading}
        </h3>
      )}
    </div>
  );
};
