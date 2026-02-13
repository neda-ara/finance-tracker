import { Check } from "lucide-react";
import { Command, CommandItem, CommandList } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
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

  const selectedOptions = options.filter((o) => value.includes(o.value));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex min-h-10 w-full flex-wrap items-center gap-1 rounded-md border px-3 py-2 text-sm">
          {selectedOptions.length === 0 && (
            <span className="text-muted-foreground">{placeholder}</span>
          )}

          {selectedOptions.map((option) => (
            <span
              key={option.value}
              className="bg-primary/10 text-primary flex items-center gap-1 rounded px-2 py-0.5 text-xs"
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
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
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
        </Command>
      </PopoverContent>
    </Popover>
  );
}
