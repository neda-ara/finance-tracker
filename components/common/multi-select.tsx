import { Check } from "lucide-react";
import { Command, CommandItem, CommandList } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type MultiSelectProps = {
  options: { label: string; value: string; icon?: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
};

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
}: MultiSelectProps) {
  const toggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const selectedOptions = useMemo(
    () =>
      value
        .map((val) => options.find((o) => o.value === val))
        .filter(Boolean) as typeof options,
    [value, options]
  );

  const triggerRef = useRef<HTMLButtonElement>(null);
  const measurementRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(
    selectedOptions.length
  );

  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    const measurementContainer = measurementRef.current;

    if (!trigger || !measurementContainer) return;

    const availableWidth = trigger.offsetWidth - 24;

    let usedWidth = 0;
    let count = 0;

    const chipElements = Array.from(
      measurementContainer.children
    ) as HTMLElement[];

    for (const chip of chipElements) {
      const chipWidth = chip.offsetWidth + 4;

      if (usedWidth + chipWidth > availableWidth) break;

      usedWidth += chipWidth;
      count++;
    }

    requestAnimationFrame(() => {
      setVisibleCount(count);
    });
  }, [selectedOptions]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          className="flex h-10 w-full items-center overflow-hidden rounded-md border px-3 py-2 text-sm"
        >
          {selectedOptions.length === 0 ? (
            <span className="text-muted-foreground truncate">
              {placeholder}
            </span>
          ) : (
            <div className="flex w-full items-center gap-1 overflow-hidden">
              {selectedOptions.slice(0, visibleCount).map((option) => (
                <span
                  key={option.value}
                  className="bg-primary/10 text-primary flex shrink-0 items-center gap-1 rounded px-2 py-0.5 text-xs whitespace-nowrap"
                >
                  {option.icon && (
                    <Image
                      src={option.icon}
                      alt={option.label}
                      className="h-3 w-3"
                      height={100}
                      width={100}
                    />
                  )}
                  {option.label}
                </span>
              ))}

              {visibleCount < selectedOptions.length && (
                <span className="text-muted-foreground shrink-0 text-xs">
                  +{selectedOptions.length - visibleCount}
                </span>
              )}
            </div>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <Command>
          <div
            className="max-h-75 overflow-y-scroll overflow-x-hidden custom-scrollbar"
            onWheel={(e) => e.stopPropagation()}
          >
            <CommandList>
              {options.map((option) => {
                const selected = value.includes(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggle(option.value)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {option.icon && (
                        <Image
                          src={option.icon}
                          alt={option.label}
                          className="h-4 w-4"
                          height={100}
                          width={100}
                        />
                      )}
                      {option.label}
                    </div>

                    {selected && <Check className="size-4" />}
                  </CommandItem>
                );
              })}
            </CommandList>
          </div>
        </Command>
      </PopoverContent>
      <div
        ref={measurementRef}
        className="absolute invisible whitespace-nowrap pointer-events-none"
      >
        {selectedOptions.map((option) => (
          <span
            key={option.value}
            className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs whitespace-nowrap"
          >
            {option.icon && (
              <Image
                src={option.icon}
                alt={option.label}
                className="h-3 w-3"
                height={100}
                width={100}
              />
            )}
            {option.label}
          </span>
        ))}
      </div>
    </Popover>
  );
}
