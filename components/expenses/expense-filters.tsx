"use client";

import { FunnelPlus, Search } from "lucide-react";
import { Input } from "../ui/input";
import { DatePicker } from "../common/date-picker";
import { Button } from "../ui/button";

export const ExpenseFilters = () => {
  return (
    <div className="w-full flex items-center justify-between my-8">
      {/* SEARCHBAR */}
      <div className="relative w-72">
        <div className="bg-accent absolute left-[1.1px] top-[0.625px] rounded-tl-[7px] rounded-bl-[7px] flex items-center justify-center h-8.5 w-10">
          <Search className=" w-5 h-5" />
        </div>
        <Input placeholder="Search by description" className="pl-12" />
      </div>
      <div className="flex items-center gap-x-4">
        <div className="flex items-center gap-x-2">
          <DatePicker value={new Date()} onChange={() => {}} />
          <DatePicker value={new Date()} onChange={() => {}} />
        </div>
        <Button>
          <FunnelPlus />
          Add Filters
        </Button>
      </div>
    </div>
  );
};
