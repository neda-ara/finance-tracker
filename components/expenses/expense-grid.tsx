"use client";

import {
  ACTION_CONSTANTS,
  CURRENCIES,
  DEFAULT_VALUES,
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_ICONS_BASE_PATH,
  IMAGE_PATHS,
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
import { DeleteConfirmationBody } from "../common/common";
import { ExpenseForm } from "./expense-form";
import { formatDateForDisplay, isStringEqual } from "@/lib/utils/utils";
import { Modal } from "../common/modal";
import { Spinner } from "../ui/spinner";
import { useExpenses } from "@/hooks/use-expenses";
import { useMemo, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export const ExpenseGrid = () => {
  const [action, setAction] = useState<ActionConstant | undefined>();
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_VALUES.PAGE_SIZE);
  const [quickActionData, setQuickActionData] = useState<Expense | undefined>();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { query, mutations } = useExpenses({
    page: pageNo,
    pageSize,
    searchKey: "",
    filters: {},
  });

  const handleDeleteExpense = async () => {
    if (!quickActionData?.id) {
      toast.error("Expense ID missing");
      return;
    }
    const resp = await mutations.delete.mutateAsync(quickActionData.id);

    if (!resp.ok) {
      toast.error(resp.error.message ?? "Failed to delete expense");
      return;
    }

    handleCloseModal();
    toast.success("Expense deleted successfully!");
  };

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
      accessorFn: (row) => new Date(row.expenseDate).getTime(),
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0!"
        >
          Expense Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
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
        body: (
          <DeleteConfirmationBody
            entity={
              quickActionData && quickActionData.currency
                ? `expense of ${
                    CURRENCIES[
                      quickActionData.currency as keyof typeof CURRENCIES
                    ].symbol
                  } ${quickActionData.amount}`
                : "expense"
            }
          />
        ),
      },
    ],
  ]);

  const handlePageSizeChange = (size: number) => {
    setPageNo(1);
    setPageSize(size);
  };

  const deleteInProgress = mutations.delete.isPending;
  const summaryData = useMemo(() => query?.data?.summary, [query?.data]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <div className="card space-y-2">
            <div className="flex gap-x-5">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Spent this month
                </p>
                <p className="font-bold text-lg tracking-wider">
                  <span className="mr-1">
                    {
                      CURRENCIES[
                        summaryData?.spentThisMonth
                          ?.currency as keyof typeof CURRENCIES
                      ]?.symbol
                    }
                  </span>
                  {summaryData?.spentThisMonth?.amount?.toLocaleString()}
                </p>
              </div>
              <Image
                alt={"month-calendar"}
                height={64}
                width={64}
                className="h-12 w-12 object-contain"
                src={IMAGE_PATHS.MONTH}
              />
            </div>
          </div>
          <div className="card space-y-2">
            <div className="flex gap-x-5">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Spent in last 30 days
                </p>
                <p className="font-bold text-lg tracking-wider">
                  <span className="mr-1">
                    {
                      CURRENCIES[
                        summaryData?.spentLast30Days
                          ?.currency as keyof typeof CURRENCIES
                      ]?.symbol
                    }
                  </span>
                  {summaryData?.spentLast30Days?.amount.toLocaleString()}
                </p>
              </div>
              <Image
                alt={"month-calendar"}
                height={64}
                width={64}
                className="h-12 w-12 object-contain"
                src={IMAGE_PATHS["30DAYS"]}
              />
            </div>
          </div>
        </div>
        <Button
          variant="cta"
          className="font-medium"
          onClick={() => actionHandler(ACTION_CONSTANTS.ADD)}
        >
          <Plus /> Add New Expense
        </Button>
      </div>
      <Modal
        open={openModal}
        onOpenChange={handleOpenModal}
        dialogTitle={modalContentMap.get(action!)?.header}
        dialogContent={modalContentMap.get(action!)?.body}
        customStyles={{
          dialogContent:
            action === ACTION_CONSTANTS.DELETE
              ? "sm:max-w-116"
              : "sm:max-w-144",
        }}
        showFooter={action === ACTION_CONSTANTS.DELETE}
        footerContent={
          <div className="flex items-center gap-x-2">
            <Button
              onClick={handleCloseModal}
              variant="outline"
              disabled={deleteInProgress}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteExpense}
              variant="destructive"
              disabled={deleteInProgress}
            >
              {mutations.delete.isPending && <Spinner />}&nbsp;Delete
            </Button>
          </div>
        }
        showCloseButton={false}
      />
      <DataGrid
        data={query?.data?.data || []}
        columns={columns}
        isLoading={query?.isPending}
        paginationParams={{
          pageNo,
          pageSize,
          totalPages: query?.data?.totalPages ?? 0,
          onPageChange: setPageNo,
          onPageSizeChange: handlePageSizeChange,
        }}
        customStyles={{
          tableContainerStyles: "max-h-106 min-h-106",
        }}
      />
    </div>
  );
};
