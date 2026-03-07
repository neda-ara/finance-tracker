"use client";

import {
  ACTION_CONSTANTS,
  CURRENCIES,
  DEFAULT_VALUES,
  IMAGE_PATHS,
  VALIDATION,
} from "@/lib/constants/constants";
import {
  ActionConstant,
  Earning,
  EarningsFiltersType,
  ModalContent,
} from "@/lib/actions/types";
import { ArrowUpDown, PencilLine, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { createActionsColumn, DataGrid } from "../common/data-grid";
import { DeleteConfirmationBody, KpiCard } from "../common/common";
import { EarningFilters } from "./earning-filters";
import { EarningForm } from "./earning-form";
import { formatDateForDisplay } from "@/lib/utils/utils";
import { Modal } from "../common/modal";
import { Spinner } from "../ui/spinner";
import { useEarnings } from "@/hooks/use-earnings";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

export const EarningsGrid = () => {
  const [action, setAction] = useState<ActionConstant | undefined>();
  const [appliedFilters, setAppliedFilters] = useState<EarningsFiltersType>(
    () => {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      return {
        searchQuery: "",
        startDate: oneYearAgo,
        endDate: new Date(),
        minAmount: 0,
        maxAmount: Math.ceil(VALIDATION.EARNING.MAX_AMOUNT_LIMIT) / 2,
        currencies: [],
      };
    },
  );
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_VALUES.PAGE_SIZE);
  const [quickActionData, setQuickActionData] = useState<Earning | undefined>();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { query, summaryQuery, mutations } = useEarnings({
    page: pageNo,
    pageSize,
    filters: appliedFilters,
  });

  const handleDeleteEarning = async () => {
    if (!quickActionData?.id) {
      toast.error("Earning ID missing");
      return;
    }
    const resp = await mutations.delete.mutateAsync(quickActionData.id);

    if (!resp.ok) {
      toast.error(resp.error.message ?? "Failed to delete earning");
      return;
    }

    handleCloseModal();
    toast.success("Earning deleted successfully!");
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const actionHandler = (action: ActionConstant, data?: Earning) => {
    setAction(action);
    setQuickActionData(data);
    handleOpenModal();
  };

  const columns: ColumnDef<Earning>[] = [
    {
      accessorKey: "receivedDate",
      accessorFn: (row) => new Date(row.receivedDate).getTime(),
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold px-0!"
        >
          Received On Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => formatDateForDisplay(row.original.receivedDate),
      enableSorting: true,
      enableHiding: false,
    },
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
    {
      accessorKey: "source",
      header: "Source",
      enableHiding: true,
    },
    {
      accessorKey: "description",
      header: "Description",
      enableHiding: true,
    },
    createActionsColumn<Earning>([
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
        header: <p>Add New Earning</p>,
        body: (
          <EarningForm
            onCancel={handleCloseModal}
            onSubmit={(formData) => mutations.create.mutateAsync(formData)}
            submitButtonText={`Add Earning`}
            submitInProgress={mutations.create.isPending}
          />
        ),
      },
    ],
    [
      ACTION_CONSTANTS.EDIT,
      {
        header: <p>Update Earning - {quickActionData?.amount}</p>,
        body: (
          <EarningForm
            initialValues={quickActionData}
            onCancel={handleCloseModal}
            onSubmit={(formData) => mutations.update.mutateAsync(formData)}
            submitButtonText={`Edit Earning`}
            submitInProgress={mutations.update.isPending}
          />
        ),
      },
    ],
    [
      ACTION_CONSTANTS.DELETE,
      {
        header: <p>Delete Earning</p>,
        body: (
          <DeleteConfirmationBody
            entity={
              quickActionData && quickActionData.currency
                ? `earning of ${
                    CURRENCIES[
                      quickActionData.currency as keyof typeof CURRENCIES
                    ].symbol
                  } ${quickActionData.amount} from ${formatDateForDisplay(
                    quickActionData.receivedDate,
                  )}`
                : "earning"
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
            title="Earned this month"
            imageSrc={IMAGE_PATHS.MONTH}
            imageAlt="month-calendar"
            isLoading={query.isPending}
            fallbackText="No earnings yet"
          >
            {summaryData?.earnedThisMonth?.amount != null && (
              <p className="font-bold text-lg tracking-wider">
                <span className="mr-1">
                  {
                    CURRENCIES[
                      summaryData?.earnedThisMonth
                        ?.currency as keyof typeof CURRENCIES
                    ]?.symbol
                  }
                </span>
                {summaryData?.earnedThisMonth?.amount?.toLocaleString()}
              </p>
            )}
          </KpiCard>
          <KpiCard
            title="Earned over the past year"
            imageSrc={IMAGE_PATHS.YEAR}
            imageAlt="month-calendar"
            isLoading={query.isPending}
            fallbackText="No earnings yet"
          >
            {summaryData?.earnedPastYear?.amount != null && (
              <p className="font-bold text-lg tracking-wider">
                <span className="mr-1">
                  {
                    CURRENCIES[
                      summaryData?.earnedPastYear
                        ?.currency as keyof typeof CURRENCIES
                    ]?.symbol
                  }
                </span>
                {summaryData?.earnedPastYear?.amount.toLocaleString()}
              </p>
            )}
          </KpiCard>
        </div>
        <Button
          variant="cta"
          className="font-medium"
          onClick={() => actionHandler(ACTION_CONSTANTS.ADD)}
        >
          <Plus /> Add New Earning
        </Button>
      </div>
      <EarningFilters filters={appliedFilters} setFilters={setAppliedFilters} />
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
              onClick={handleDeleteEarning}
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
