"use client";

import { Button } from "../ui/button";
import { DatePicker } from "../common/date-picker";
import { Dispatch, SetStateAction, useState } from "react";
import {
  CURRENCIES,
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_ICONS_BASE_PATH,
} from "@/lib/constants/constants";
import { ExpenseFiltersType } from "@/lib/actions/types";
import { FunnelPlus, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Modal } from "../common/modal";
import { MultiSelect } from "../common/multi-select";
import { RangeSlider } from "../ui/slider";

export const ExpenseFilters = ({
  filters,
  setFilters,
}: {
  filters: ExpenseFiltersType;
  setFilters: Dispatch<SetStateAction<ExpenseFiltersType>>;
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleSetFilterByParam = (param: string, value: unknown) => {
    setFilters((prev: ExpenseFiltersType) => ({
      ...prev,
      [param]: value,
    }));
  };

  console.log({ filters });

  return (
    <>
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
          {/* DATE RANGE PICKER */}
          <div className="flex items-center gap-x-2">
            <DatePicker
              label="Start Date"
              labelPlacement="inside"
              value={filters.startDate as Date}
              onChange={(e) => handleSetFilterByParam("startDate", e)}
            />
            <DatePicker
              label="End Date"
              labelPlacement="inside"
              value={filters.endDate as Date}
              onChange={(e) => handleSetFilterByParam("endDate", e)}
            />
          </div>
          <Button onClick={handleOpenModal}>
            <FunnelPlus />
            Add Filters
          </Button>
        </div>
      </div>
      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        dialogTitle={"Choose More Filters"}
        dialogContent={
          <ExtraFiltersModalContent
            filters={filters}
            handleCloseModal={handleCloseModal}
            handleSetFilterByParam={handleSetFilterByParam}
            setFilters={setFilters}
          />
        }
        customStyles={{
          dialogContent: "sm:max-w-125",
        }}
        showFooter={false}
        showCloseButton={true}
      />
    </>
  );
};

const ExtraFiltersModalContent = ({
  filters,
  handleCloseModal,
  handleSetFilterByParam,
  setFilters,
}: {
  filters: ExpenseFiltersType;
  handleCloseModal: () => void;
  handleSetFilterByParam: (param: string, value: unknown) => void;
  setFilters: Dispatch<SetStateAction<ExpenseFiltersType>>;
}) => {
  return (
    <div>
      <div className="flex flex-col gap-y-3">
        <div className="flex items-center gap-x-4 mt-4 mb-9">
          <Label className="text-xs text-center leading-4 font-medium">
            Adjust Amount Range
          </Label>
          <RangeSlider
            min={0}
            max={1000000}
            step={1000}
            valuePosition="bottom"
            value={[filters.minAmount, filters.maxAmount]}
            onChange={([min, max]) =>
              setFilters((prev) => ({
                ...prev,
                minAmount: min,
                maxAmount: max,
              }))
            }
            customStyles={{ wrapper: "pr-4 w-full" }}
          />
        </div>
        <div className="flex items-center gap-x-4">
          <div className="space-y-1 w-1/2">
            <Label className="font-medium text-xs">Min Amount</Label>
            <Input
              placeholder="Min Amount"
              value={filters.minAmount}
              onChange={(e) =>
                handleSetFilterByParam("minAmount", e.target.value)
              }
            />
          </div>
          <div className="space-y-1 w-1/2">
            <Label className="font-medium text-xs">Max Amount</Label>
            <Input
              placeholder="Max Amount"
              value={filters.maxAmount}
              onChange={(e) =>
                handleSetFilterByParam("maxAmount", e.target.value)
              }
            />
          </div>
          <div className="space-y-1 w-full">
            <Label className="font-medium text-xs">Select Currencies</Label>
            <MultiSelect
              value={filters.currencies}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, currencies: val }))
              }
              options={Object.values(CURRENCIES).map((currency) => ({
                value: currency.code,
                label: `${currency.symbol} ${currency.name}`,
              }))}
            />
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <div className="space-y-1 w-full">
            <Label className="font-medium text-xs">Select Categories</Label>
            <MultiSelect
              value={filters.categories}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, categories: val }))
              }
              options={EXPENSE_CATEGORIES.map((item) => ({
                label: item.title,
                value: item.title,
                icon: `${EXPENSE_CATEGORY_ICONS_BASE_PATH}${item?.iconPath}`,
              }))}
            />
          </div>
        </div>
        <div className="flex items-center gap-x-4"></div>
      </div>
      <div className="flex items-center gap-x-2 justify-end mt-6">
        <Button variant="destructive" className="bg-red-500 hover:bg-red-600">
          Clear Filters
        </Button>
        <Button className="bg-green-400 hover:bg-green-500">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
