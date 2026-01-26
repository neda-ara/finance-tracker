"use client";

import { ACTION_CONSTANTS } from "@/lib/constants/constants";
import { ActionConstant, ModalContent } from "@/lib/actions/types";
import { Button } from "../ui/button";
import { DataGrid } from "../common/data-grid";
import { ExpenseForm } from "./expense-form";
import { Modal } from "../common/modal";
import { ArrowUpDown, Plus } from "lucide-react";
import { useExpenses } from "@/hooks/use-expenses";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

type Expense = {
  amount: number;
  category: string;
};

export const ExpenseGrid = () => {
  const [action, setAction] = useState<ActionConstant | undefined>();
  const [quickActionData, setQuickActionData] = useState<Expense | undefined>();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { query, mutations } = useExpenses({
    page: 1,
    pageSize: 10,
    searchKey: "",
    filters: {},
  });

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const actionHandler = (action: ActionConstant, data?: Expense) => {
    setAction(action);
    setQuickActionData(data);
    handleOpenModal();
  };

  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: "expenseDate",
      header: "Expense Date",
      enableSorting: true,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0!"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "currency",
      header: "Currency",
      enableHiding: true,
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "paymentMode",
      header: "Payment Mode",
      enableHiding: true,
    },
  ];

  const modalContentMap = new Map<ActionConstant, ModalContent>([
    [
      ACTION_CONSTANTS.ADD,
      {
        header: <p>Add New Expense</p>,
        body: (
          <ExpenseForm
            onCancel={handleCloseModal}
            onSubmit={(formData) => mutations.create.mutateAsync(formData)}
            submitButtonText={`Add Expense`}
            submitInProgress={mutations.create.isPending}
          />
        ),
      },
    ],
    [
      ACTION_CONSTANTS.EDIT,
      {
        header: <p>Update Expense - {quickActionData?.amount}</p>,
        body: (
          <ExpenseForm
            submitButtonText={`Edit Expense`}
            onCancel={handleCloseModal}
          />
        ),
      },
    ],
    [
      ACTION_CONSTANTS.DELETE,
      {
        header: <p>Delete Expense</p>,
        body: <p>Are you sure</p>,
      },
    ],
  ]);

  console.log("q", query?.data);

  return (
    <div>
      <Button
        variant="cta"
        className="font-medium"
        onClick={() => actionHandler(ACTION_CONSTANTS.ADD)}
      >
        <Plus /> Add New
      </Button>
      <Modal
        open={openModal}
        onOpenChange={handleOpenModal}
        dialogTitle={modalContentMap.get(action!)?.header}
        dialogContent={modalContentMap.get(action!)?.body}
        customStyles={{
          dialogContent: "sm:max-w-160",
        }}
        showFooter={false}
        showCloseButton={false}
      />
      <DataGrid data={query?.data?.data || []} columns={columns} />
    </div>
  );
};
