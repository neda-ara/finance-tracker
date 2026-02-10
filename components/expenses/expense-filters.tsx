"use client";

import { Button } from "../ui/button";
import { DatePicker } from "../common/date-picker";
import { Dispatch, SetStateAction } from "react";
import { ExpenseFiltersType } from "@/lib/actions/types";
import { FunnelPlus, Search } from "lucide-react";
import { Input } from "../ui/input";

export const ExpenseFilters = ({
  filters,
  setFilters,
}: {
  filters: ExpenseFiltersType;
  setFilters: Dispatch<SetStateAction<ExpenseFiltersType>>;
}) => {
  const handleSetFilterByParam = (param: string, value: unknown) => {
    setFilters((prev: ExpenseFiltersType) => ({
      ...prev,
      [param]: value,
    }));
  };

  console.log({ filters });

  return (
    <div className="w-full flex items-center justify-between my-8">
      {/* SEARCHBAR */}
      <div className="relative w-72">
        <div className="bg-accent absolute left-[1.1px] top-[0.625px] rounded-tl-[7px] rounded-bl-[7px] flex items-center justify-center h-8.5 w-10">
          <Search className=" w-5 h-5" />
        </div>
        <Input
          placeholder="Search by description"
          className="pl-12"
          onChange={(e) =>
            handleSetFilterByParam("description", e.target.value)
          }
        />
      </div>
      <div className="flex items-center gap-x-4">
        <div className="flex items-center gap-x-2">
          <DatePicker
            value={filters.startDate as Date}
            onChange={(e) => handleSetFilterByParam("startDate", e)}
          />
          <DatePicker
            value={filters.endDate as Date}
            onChange={(e) => handleSetFilterByParam("endDate", e)}
          />
        </div>
        <Button>
          <FunnelPlus />
          Add Filters
        </Button>
      </div>
    </div>
  );
};
