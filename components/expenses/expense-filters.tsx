"use client";

import { Button } from "../ui/button";
import { DatePicker } from "../common/date-picker";
import { Dispatch, SetStateAction, useState } from "react";
import {
  CURRENCIES,
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_ICONS_BASE_PATH,
  PAYMENT_MODE,
  SATISFACTION_ICONS_BASE_PATH,
  SATISFACTION_RATINGS,
} from "@/lib/constants/constants";
import { ExpenseFiltersType } from "@/lib/actions/types";
import { FunnelPlus, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Modal } from "../common/modal";
import { MultiSelect } from "../common/multi-select";
import { RangeSlider } from "../ui/slider";
import { sanitizeNumberInput } from "@/lib/utils/utils";

export const ExpenseFilters = ({
  filters,
  setFilters,
}: {
  filters: ExpenseFiltersType;
  setFilters: Dispatch<SetStateAction<ExpenseFiltersType>>;
}) => {
  const [draftFilters, setDraftFilters] = useState<ExpenseFiltersType>(filters);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    setDraftFilters(filters);
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);

  const handleSetFilterByParam = (param: string, value: unknown) => {
    setFilters((prev: ExpenseFiltersType) => ({
      ...prev,
      [param]: value,
    }));
  };

  const handleSetDraftFilterByParam = (param: string, value: unknown) => {
    setDraftFilters((prev: ExpenseFiltersType) => ({
      ...prev,
      [param]: value,
    }));
  };

  const handleClearFilters = () => {
    setDraftFilters({
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      minAmount: 0,
      maxAmount: 500000,
      categories: [],
      currencies: [],
      paymentModes: [],
      satisfactionRatings: [],
    });
    handleCloseModal();
  };

  const handleApplyFilters = () => {
    setFilters(draftFilters);
    handleCloseModal();
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
            draftFilters={draftFilters}
            handleApplyFilters={handleApplyFilters}
            handleClearFilters={handleClearFilters}
            handleSetDraftFilterByParam={handleSetDraftFilterByParam}
            setDraftFilters={setDraftFilters}
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
  draftFilters,
  handleApplyFilters,
  handleClearFilters,
  handleSetDraftFilterByParam,
  setDraftFilters,
}: {
  draftFilters: ExpenseFiltersType;
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
  handleSetDraftFilterByParam: (param: string, value: unknown) => void;
  setDraftFilters: Dispatch<SetStateAction<ExpenseFiltersType>>;
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
            value={[draftFilters.minAmount, draftFilters.maxAmount]}
            onChange={([min, max]) =>
              setDraftFilters((prev) => ({
                ...prev,
                minAmount: min,
                maxAmount: max,
              }))
            }
            customStyles={{ wrapper: "pr-4 w-full" }}
          />
        </div>
        <div className="flex items-center gap-x-2">
          <div className="space-y-1">
            <Label className="font-medium text-xs">Min Amount</Label>
            <Input
              placeholder="Min Amount"
              value={draftFilters.minAmount}
              min={0}
              max={1000000}
              onChange={(e) =>
                handleSetDraftFilterByParam(
                  "minAmount",
                  sanitizeNumberInput(
                    e.target.value,
                    0,
                    1000000,
                    Number(draftFilters.maxAmount)
                  )
                )
              }
            />
          </div>
          <div className="space-y-1">
            <Label className="font-medium text-xs">Max Amount</Label>
            <Input
              placeholder="Max Amount"
              value={draftFilters.maxAmount}
              min={0}
              max={1000000}
              onChange={(e) =>
                handleSetDraftFilterByParam(
                  "maxAmount",
                  sanitizeNumberInput(e.target.value, 0, 1000000)
                )
              }
            />
          </div>
          <div className="space-y-1 w-full">
            <Label className="font-medium text-xs min-w-fit">Currencies</Label>
            <MultiSelect
              placeholder="Choose currencies..."
              value={draftFilters.currencies}
              onChange={(val) =>
                setDraftFilters((prev) => ({ ...prev, currencies: val }))
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
            <Label className="font-medium text-xs">Categories</Label>
            <MultiSelect
              placeholder="Choose categories..."
              value={draftFilters.categories}
              onChange={(val) =>
                setDraftFilters((prev) => ({ ...prev, categories: val }))
              }
              options={EXPENSE_CATEGORIES.map((item) => ({
                label: item.title,
                value: item.title,
                icon: `${EXPENSE_CATEGORY_ICONS_BASE_PATH}${item?.iconPath}`,
              }))}
            />
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <div className="space-y-1 w-full max-w-36">
            <Label className="font-medium text-xs">Payment Mode(s)</Label>
            <MultiSelect
              placeholder="Choose payment modes..."
              value={draftFilters.paymentModes}
              onChange={(val) =>
                setDraftFilters((prev) => ({ ...prev, paymentModes: val }))
              }
              options={PAYMENT_MODE}
            />
          </div>
          <div className="space-y-1 w-full">
            <Label className="font-medium text-xs">
              Was the spend worth it?
            </Label>
            <MultiSelect
              placeholder="Choose satisfaction levels..."
              value={draftFilters.satisfactionRatings}
              onChange={(val) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  satisfactionRatings: val,
                }))
              }
              options={Object.entries(SATISFACTION_RATINGS).map(
                ([key, rating]) => ({
                  value: String(key),
                  label: rating.title,
                  icon: `${SATISFACTION_ICONS_BASE_PATH}${rating.iconPath}`,
                })
              )}
            />
          </div>
        </div>
        <div className="flex items-center gap-x-4"></div>
      </div>
      <div className="flex items-center gap-x-2 justify-end mt-6">
        <Button
          variant="destructive"
          className="bg-red-500 hover:bg-red-600"
          onClick={handleClearFilters}
        >
          Clear Filters
        </Button>
        <Button
          className="bg-green-400 hover:bg-green-500"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
