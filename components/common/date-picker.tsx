"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { DatePickerProps } from "@/lib/actions/types";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
  value,
  onChange,
  label,
  labelPlacement = "outside",
  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative flex flex-col gap-2">
      {label && (
        <Label
          className={
            labelPlacement === "inside"
              ? "absolute -top-[8.25px] left-2 bg-white text-xs"
              : "px-1 text-sm"
          }
        >
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-36 justify-between font-normal"
          >
            {value ? value.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            disabled={props?.disabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
