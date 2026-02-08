"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { DataGridProps, RowAction } from "@/lib/actions/types";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { IMAGE_PATHS, PAGE_SIZE_OPTONS } from "@/lib/constants/constants";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import Image from "next/image";

export function createActionsColumn<T>(actions: RowAction<T>[]): ColumnDef<T> {
  return {
    id: "actions",
    accessorKey: "Actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-x-3">
        {actions.map((action, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="w-fit"
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(row.original);
                }}
              >
                {action.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{action.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    ),
  };
}

export function DataGrid<T>({
  data,
  columns,
  paginationParams,
  customStyles,
}: DataGridProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const hasRowSelection = columns.some((col) => col.id === "select");

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: paginationParams.totalPages,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    ...(hasRowSelection && {
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
    }),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      ...(hasRowSelection && { rowSelection }),
    },
  });

  return (
    <div className="w-full pt-7">
      <div className="overflow-hidden rounded-md border">
        <Table containerStyles={customStyles?.tableContainerStyles}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="sticky! top-0! z-10">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="max-w-56 whitespace-normal wrap-break-word"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center italic py-8 font-medium"
                >
                  <Image
                    alt="no-results"
                    height={100}
                    width={100}
                    src={IMAGE_PATHS.NO_RESULTS}
                    className="h-16 object-contain mb-2 mx-auto"
                  />
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        {hasRowSelection && (
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Select Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                    onSelect={(e) => e.preventDefault()}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    paginationParams.onPageChange(paginationParams.pageNo - 1)
                  }
                  isActive={paginationParams.pageNo > 10}
                  isDisabled={paginationParams.pageNo === 1}
                />
              </PaginationItem>
              {Array.from({ length: paginationParams.totalPages }, (_, i) => {
                const p = i + 1;
                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === paginationParams.pageNo}
                      onClick={() => paginationParams.onPageChange(p)}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    paginationParams.onPageChange(paginationParams.pageNo + 1)
                  }
                  isDisabled={
                    paginationParams.pageNo === paginationParams.totalPages
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <Select
            value={String(paginationParams.pageSize)}
            onValueChange={(v) => paginationParams.onPageSizeChange(Number(v))}
          >
            <SelectTrigger className="w-30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
