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
  valuePosition?: "top" | "bottom" | "none";
};

type RangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  label?: string;
  valuePosition?: "top" | "bottom" | "none";
};

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  sliderStyle,
  valuePosition = "none",
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
          key={index}
          className="relative cursor-pointer block size-6 shrink-0 rounded-full border bg-white shadow-md"
        >
          {valuePosition !== "none" && (
            <div
              className={cn(
                "absolute left-1/2 -translate-x-1/2 whitespace-nowrap",
                valuePosition === "top" ? "-top-9" : "top-9"
              )}
            >
              <div className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-md shadow">
                {_values[index].toLocaleString()}
              </div>
              <div
                className={cn(
                  "mx-auto w-2 h-2 bg-primary",
                  valuePosition === "top"
                    ? "-mt-1 rotate-45"
                    : "-mt-7 rotate-225"
                )}
              />
            </div>
          )}
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  );
}

function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  valuePosition = "top",
}: RangeSliderProps) {
  return (
    <div className="space-y-3">
      {label && (
        <div className="flex justify-between text-sm font-medium">
          <span>{label}</span>
          <span>
            {value[0]} - {value[1]}
          </span>
        </div>
      )}
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(val) => onChange(val as [number, number])}
        valuePosition={valuePosition}
      />
    </div>
  );
}

export { Slider, RangeSlider };
