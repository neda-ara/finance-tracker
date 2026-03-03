"use client";

import { Baloo_Tamma_2 } from "next/font/google";
import { JSX } from "react";

const bt2 = Baloo_Tamma_2({
  weight: ["400", "500", "600", "700", "800"],
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
        className={`${bt2.className} flex items-center font-bold text-4xl leading-tight text-(--color-primary) [text-shadow:1.5px_1.5px_0_var(--color-secondary)]`}
      >
        {icon}
        {heading}
      </h1>
      {subheading && (
        <h3
          className={`${bt2.className} text-lg font-medium text-muted-foreground/75 leading-tight [text-shadow:1px_1px_0_rgba(0,0,0,0.1)]`}
        >
          {subheading}
        </h3>
      )}
    </div>
  );
};
