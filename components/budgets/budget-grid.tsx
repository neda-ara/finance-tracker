"use client";

import {
  ACTION_CONSTANTS,
  CURRENCIES,
  DEFAULT_VALUES,
  IMAGE_PATHS,
  VALIDATION,
} from "@/lib/constants/constants";
import { ActionConstant, Budget, ModalContent } from "@/lib/actions/types";
import { ArrowUpDown, PencilLine, Plus, Trash2 } from "lucide-react";
import { BudgetForm } from "./budget-form";
import { Button } from "../ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { createActionsColumn, DataGrid } from "../common/data-grid";
import { DeleteConfirmationBody, KpiCard } from "../common/common";
import { formatDateForDisplay } from "@/lib/utils/utils";
import { Modal } from "../common/modal";
import { Spinner } from "../ui/spinner";
import { useBudgets } from "@/hooks/use-budgets";
import { useEffect, useMemo, useState } from "react";
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
      enableHiding: true,
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
                ? `budget of ${
                    CURRENCIES[
                      quickActionData.currency as keyof typeof CURRENCIES
                    ].symbol
                  } ${quickActionData.amount} for ${quickActionData.category} `
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

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <KpiCard
            title="Monthly Budget"
            imageSrc={IMAGE_PATHS.MONTH}
            imageAlt="month-calendar"
            isLoading={query.isPending}
            fallbackText="No monthly budget set"
          >
            {summaryData?.total?.amount != null && (
              <p className="font-bold text-lg tracking-wider">
                <span className="mr-1">
                  {
                    CURRENCIES[
                      summaryData?.total?.currency as keyof typeof CURRENCIES
                    ]?.symbol
                  }
                </span>
                {summaryData?.total?.amount?.toLocaleString()}
              </p>
            )}
          </KpiCard>
          <KpiCard
            title="Spent this year"
            imageSrc={IMAGE_PATHS.YEAR}
            imageAlt="month-calendar"
            isLoading={query.isPending}
            fallbackText="No expenses yet"
          >
            {summaryData?.spent?.amount != null && (
              <p className="font-bold text-lg tracking-wider">
                <span className="mr-1">
                  {
                    CURRENCIES[
                      summaryData?.spent?.currency as keyof typeof CURRENCIES
                    ]?.symbol
                  }
                </span>
                {summaryData?.spent?.amount.toLocaleString()}
              </p>
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
          gridWrapperStyles: "min-h-90",
          tableContainerStyles: "max-h-90",
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
              : "sm:max-w-136",
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
