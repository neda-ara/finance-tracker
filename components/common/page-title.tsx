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
        className={`${volkorn.className} flex items-center font-extrabold text-4xl tracking-wide leading-tight `}
      >
        {icon}
        {heading}
      </h1>
      {subheading && (
        <h3
          className={`${volkorn.className} font-medium text-xl text-muted-foreground leading-tight`}
        >
          {subheading}
        </h3>
      )}
    </div>
  );
};
