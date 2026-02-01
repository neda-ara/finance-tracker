"use client";

import {
  ACTION_CONSTANTS,
  CURRENCIES,
  DEFAULT_VALUES,
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_ICONS_BASE_PATH,
  SATISFACTION_ICONS_BASE_PATH,
  SATISFACTION_RATINGS,
} from "@/lib/constants/constants";
import {
  ActionConstant,
  Expense,
  ModalContent,
  SatisfactionRating,
} from "@/lib/actions/types";
import { ArrowUpDown, PencilLine, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { createActionsColumn, DataGrid } from "../common/data-grid";
import { ExpenseForm } from "./expense-form";
import { formatDateForDisplay, isStringEqual } from "@/lib/utils/utils";
import { Modal } from "../common/modal";
import { useExpenses } from "@/hooks/use-expenses";
import { useState } from "react";
import Image from "next/image";

export const ExpenseGrid = () => {
  const [action, setAction] = useState<ActionConstant | undefined>();
  const [quickActionData, setQuickActionData] = useState<Expense | undefined>();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { query, mutations } = useExpenses({
    page: 1,
    pageSize: DEFAULT_VALUES.PAGE_SIZE,
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
      cell: ({ row }) => formatDateForDisplay(row.original.expenseDate),
      enableSorting: true,
      enableHiding: false,
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
      cell: ({ row }) => (
        <p className="capitalize flex items-center gap-x-1">
          <span>
            {
              CURRENCIES[row.original.currency as keyof typeof CURRENCIES]
                .symbol
            }
          </span>
          {row.original.amount.toLocaleString()}
        </p>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "currency",
      header: "Currency",
      enableHiding: true,
    },
    {
      accessorKey: "category",
      header: "Category",
      enableHiding: false,
      cell: ({ row }) => {
        const category = EXPENSE_CATEGORIES.find((cat) =>
          isStringEqual(cat.title, row.original.category)
        );
        return category ? (
          <div className="flex items-center gap-2">
            <Image
              alt={category.title}
              height={56}
              width={56}
              src={`${EXPENSE_CATEGORY_ICONS_BASE_PATH}${category.iconPath}`}
              className="h-6 w-6 object-contain"
            />
            <span className="text-sm">{category.title}</span>
          </div>
        ) : (
          row.original.category
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      enableHiding: true,
    },
    {
      accessorKey: "paymentMode",
      header: "Payment Mode",
      cell: ({ row }) => (
        <p className="capitalize">{row.original.paymentMode}</p>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "satisfactionRating",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0!"
        >
          Worth it?
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const rating =
          SATISFACTION_RATINGS[
            row.original.satisfactionRating as SatisfactionRating
          ];

        return (
          <div className="flex items-center gap-2">
            <Image
              alt={rating.title}
              height={48}
              width={48}
              src={`${SATISFACTION_ICONS_BASE_PATH}${rating.iconPath}`}
              className="h-6 w-6 object-contain"
            />
            <span className={`text-xs font-semibold ${rating.color}`}>
              {rating.title}
            </span>
          </div>
        );
      },
      enableSorting: true,
    },
    createActionsColumn<Expense>([
      {
        icon: <PencilLine className="h-4 text-violet-600" />,
        label: "Edit",
        onClick: (row) => actionHandler(ACTION_CONSTANTS.EDIT, row),
      },
      {
        icon: <Trash2 className="h-4 text-destructive" />,
        label: "Delete",
        onClick: (row) => actionHandler(ACTION_CONSTANTS.DELETE, row),
      },
    ]),
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
            initialValues={quickActionData}
            onCancel={handleCloseModal}
            onSubmit={(formData) => mutations.update.mutateAsync(formData)}
            submitButtonText={`Edit Expense`}
            submitInProgress={mutations.update.isPending}
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
          dialogContent: "sm:max-w-144",
        }}
        showFooter={action === ACTION_CONSTANTS.DELETE}
        footerContent={<Button>Delete</Button>}
        showCloseButton={false}
      />
      <DataGrid data={query?.data?.data || []} columns={columns} />
    </div>
  );
};
