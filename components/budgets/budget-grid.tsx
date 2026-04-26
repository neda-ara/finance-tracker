"use client";

import {
  ACTION_CONSTANTS,
  DEFAULT_VALUES,
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_ICONS_BASE_PATH,
  IMAGE_PATHS,
} from "@/lib/constants/constants";
import { ActionConstant, Budget, ModalContent } from "@/lib/actions/types";
import { ArrowUpDown, PencilLine, Plus, Trash2 } from "lucide-react";
import { BudgetForm } from "./budget-form";
import { Button } from "../ui/button";
import {
  CircularProgress,
  DeleteConfirmationBody,
  GradientProgressBar,
  KpiCard,
} from "../common/common";
import { cn } from "@/lib/utils/shadcn-utils";
import { ColumnDef } from "@tanstack/react-table";
import { createActionsColumn, DataGrid } from "../common/data-grid";
import { getCurrencySymbol, isStringEqual } from "@/lib/utils/utils";
import { Modal } from "../common/modal";
import { Spinner } from "../ui/spinner";
import { useBudgets } from "@/hooks/use-budgets";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export const BudgetsGrid = () => {
  const [action, setAction] = useState<ActionConstant | undefined>();

  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_VALUES.PAGE_SIZE);
  const [quickActionData, setQuickActionData] = useState<Budget | undefined>();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { query, summaryQuery, mutations } = useBudgets({
    page: pageNo,
    pageSize,
  });

  useEffect(() => {
    if (query.error) {
      toast.error(query.error?.message);
    }
    if (summaryQuery.error) {
      toast.error(summaryQuery.error?.message);
    }
  }, [query.error, summaryQuery.error]);

  const handleDeleteBudget = async () => {
    if (!quickActionData?.id) {
      toast.error("Budget ID missing");
      return;
    }
    const resp = await mutations.delete.mutateAsync(quickActionData.id);

    if (!resp.ok) {
      toast.error(resp.error.message ?? "Failed to delete budget");
      return;
    }

    handleCloseModal();
    toast.success("Budget deleted successfully!");
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const actionHandler = (action: ActionConstant, data?: Budget) => {
    setAction(action);
    setQuickActionData(data);
    handleOpenModal();
  };

  const columns: ColumnDef<Budget>[] = [
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold px-0!"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <p className="capitalize flex items-center gap-x-1">
          <span>{getCurrencySymbol(row.original.currency)}</span>
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
          isStringEqual(cat.title, row.original.category),
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
      accessorKey: "spent",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold px-0!"
        >
          Spent this Month
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <p className="capitalize flex items-center gap-x-1">
          <span>{getCurrencySymbol(row.original.currency)}</span>
          {row.original.spent.toLocaleString()}
        </p>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      header: "Budget Used",
      cell: ({ row }) => {
        const { amount, spent, currency } = row.original;
        const symbol = getCurrencySymbol(currency);
        const percentage =
          amount > 0 ? Math.min((spent / amount) * 100, 100) : 0;

        const isOverBudget = spent > amount;
        const overBudgetBy = (spent - amount).toFixed(2);

        return (
          <div className="flex flex-col gap-1 w-full min-w-56 pr-24 py-2">
            <div className="flex justify-between text-xs font-medium tabular-nums">
              <span>
                {symbol}
                {spent.toLocaleString()}
              </span>

              <span>
                {symbol}
                {amount.toLocaleString()}
              </span>
            </div>

            <GradientProgressBar percentage={percentage} />
            {isOverBudget && (
              <p className="text-xs font-medium text-red-700">
                Over budget by {symbol}
                {overBudgetBy}
              </p>
            )}
          </div>
        );
      },
      enableHiding: false,
    },

    createActionsColumn<Budget>([
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
        header: <p>Add New Budget</p>,
        body: (
          <BudgetForm
            onCancel={handleCloseModal}
            onSubmit={(formData) => mutations.create.mutateAsync(formData)}
            submitButtonText={`Add Budget`}
            submitInProgress={mutations.create.isPending}
          />
        ),
      },
    ],
    [
      ACTION_CONSTANTS.EDIT,
      {
        header: (
          <p>
            Update Budget - {quickActionData?.amount} for{" "}
            {quickActionData?.category}
          </p>
        ),
        body: (
          <BudgetForm
            initialValues={quickActionData}
            onCancel={handleCloseModal}
            onSubmit={(formData) => mutations.update.mutateAsync(formData)}
            submitButtonText={`Edit Budget`}
            submitInProgress={mutations.update.isPending}
          />
        ),
      },
    ],
    [
      ACTION_CONSTANTS.DELETE,
      {
        header: <p>Delete Budget</p>,
        body: (
          <DeleteConfirmationBody
            entity={
              quickActionData && quickActionData.currency
                ? `budget of ${getCurrencySymbol(
                    quickActionData.currency,
                  )} ${quickActionData.amount} for ${quickActionData.category} `
                : "budget"
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
  const summaryData = useMemo(() => summaryQuery?.data, [summaryQuery]);

  const remainingAmount = (summaryData && summaryData?.remaining?.amount) ?? 0;
  const remainingPercentage =
    summaryData && summaryData?.remaining && summaryData?.total
      ? (summaryData.remaining.amount / summaryData.total.amount) * 100
      : 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-5 mb-8">
          <KpiCard
            title="Monthly Budget"
            imageSrc={IMAGE_PATHS.MONTH}
            imageAlt="month-calendar"
            isLoading={query.isPending}
            fallbackText="No limits set yet"
          >
            {summaryData?.total?.amount != null && (
              <p className="font-bold text-lg tracking-wider">
                <span className="mr-1">
                  {getCurrencySymbol(summaryData?.total?.currency)}
                </span>
                {summaryData?.total?.amount?.toLocaleString()}
              </p>
            )}
          </KpiCard>
          <KpiCard
            title="Budget Spent"
            imageSrc={IMAGE_PATHS.WALLET}
            imageAlt="wallet"
            isLoading={query.isPending}
            fallbackText="No spending in tracked categories"
          >
            {summaryData?.spent?.amount != null && (
              <p className="font-bold text-lg tracking-wider">
                <span className="mr-1">
                  {getCurrencySymbol(summaryData?.spent?.currency)}
                </span>
                {summaryData?.spent?.amount.toLocaleString()}
              </p>
            )}
          </KpiCard>
          <KpiCard
            title="Remaining Budget"
            isLoading={query.isPending}
            customIcon={
              <CircularProgress
                remainingPercentage={remainingPercentage}
                usedPercentage={100 - remainingPercentage}
                size={50}
              />
            }
            fallbackText="Add limits to track remaining funds"
          >
            {summaryData?.remaining?.amount != null && (
              <div className="flex items-center gap-4">
                <p
                  className={cn(
                    "font-bold text-lg tracking-wider",
                    remainingAmount < 0 && "text-red-600",
                  )}
                >
                  <span className="mr-1">
                    {getCurrencySymbol(summaryData?.remaining?.currency)}
                  </span>
                  {remainingAmount?.toLocaleString()}
                </p>
              </div>
            )}
          </KpiCard>
        </div>
        <Button
          variant="cta"
          className="font-medium"
          onClick={() => actionHandler(ACTION_CONSTANTS.ADD)}
        >
          <Plus /> Add New Budget
        </Button>
      </div>
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
          gridWrapperStyles: "min-h-106",
          tableContainerStyles: "max-h-106",
          emptyContainerStyles: "min-h-84",
        }}
      />
      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        dialogTitle={modalContentMap.get(action!)?.header}
        dialogContent={modalContentMap.get(action!)?.body}
        customStyles={{
          dialogContent:
            action === ACTION_CONSTANTS.DELETE
              ? "sm:max-w-116"
              : "sm:max-w-164",
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
              onClick={handleDeleteBudget}
              variant="destructive"
              disabled={deleteInProgress}
            >
              {mutations.delete.isPending && <Spinner />}&nbsp;Delete
            </Button>
          </div>
        }
        showCloseButton={false}
      />
    </div>
  );
};
