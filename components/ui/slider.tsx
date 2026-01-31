"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils/shadcn-utils";

type SliderStyleProps = {
  trackClass?: string;
  rangeClass?: string;
  thumbClass?: string;
};

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  sliderStyle?: SliderStyleProps;
};

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  sliderStyle,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max],
    [value, defaultValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        "data-disabled:opacity-50",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        "transition-all duration-200 ease-out",

        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "cursor-pointer bg-muted relative grow overflow-hidden rounded-full",
          "data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:w-full",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-3",
          sliderStyle?.trackClass
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute rounded-full",
            "data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
            sliderStyle?.rangeClass
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            "cursor-pointer block size-6 shrink-0 rounded-full border bg-white shadow-md transition-all hover:shadow-lg focus-visible:ring-4 focus-visible:ring-primary/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
            sliderStyle?.thumbClass
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
