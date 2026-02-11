"use client";

import { Button } from "../ui/button";
import { DatePicker } from "../common/date-picker";
import { Dispatch, SetStateAction, useState } from "react";
import { ExpenseFiltersType } from "@/lib/actions/types";
import { FunnelPlus, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Modal } from "../common/modal";
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
      <div className="flex flex-col gap-y-3 my-4">
        <RangeSlider
          min={0}
          max={100000}
          valuePosition="bottom"
          value={[filters.minAmount, filters.maxAmount]}
          onChange={([min, max]) =>
            setFilters((prev) => ({
              ...prev,
              minAmount: min,
              maxAmount: max,
            }))
          }
        />
      </div>
      <div className="flex items-center gap-x-2 mt-16">
        <Button variant="destructive">Clear Filters</Button>
      </div>
    </div>
  );
};
