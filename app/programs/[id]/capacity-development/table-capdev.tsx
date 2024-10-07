"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Table,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { CreateCapacityDevelopmentForm } from "./create-capdev-form";
import { Cross2Icon, DotsHorizontalIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { PlusIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTable } from "@/components/data-table/data-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

interface DataTableProps<TData, TValue> {
  data: TData[];
  programId: string;
}

export function TableCapDev<TData, TValue>({
  data,
  programId,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isCreateFormOpen, setIsCreateFormOpen] =
    React.useState<boolean>(false);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this capacity development?"))
      return;

    const supabase = createClient();

    const result = await supabase
      .from("capacity_developments")
      .delete()
      .eq("id", id);

    if (result.error) {
      alert("Failed to delete capacity development");
      console.log(result.error);
      return;
    }

    if (result.status === 204) {
      toast.success("Capacity development deleted successfully");
      router.refresh();
    }
  };

  const columns: ColumnDef<
    Database["public"]["Tables"]["capacity_developments"]["Row"]
  >[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => <div>{row.original.name}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => <div>{row.original.type}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "capacity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Capcity" />
      ),
      cell: ({ row }) => <div>{row.original.total_participant_capacity}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => <div>{row.original.status}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <DotsHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem
              onClick={() => {
                handleDelete(row.original.id);
              }}
            >
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    // @ts-ignore
    data,
    // @ts-ignore
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        onAdd={() => {
          setIsCreateFormOpen(true);
        }}
        onSearch={(value) => {
          const params = new URLSearchParams(searchParams);
          if (value) {
            params.set("search", value);
          } else {
            params.delete("search");
          }

          router.replace(`${pathname}?${params.toString()}`);
        }}
      />

      {/* @ts-ignore */}
      <DataTable table={table} columns={columns} data={data} />
      <Sheet open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
        <SheetContent className="min-w-[700px] overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>Add Capacity Development</SheetTitle>
          </SheetHeader>
          <div className="py-2">
            <CreateCapacityDevelopmentForm
              programId={programId}
              onSuccess={() => {
                setIsCreateFormOpen(false);
                toast.success("Capacity development added successfully");
                router.refresh();
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onAdd: () => void;
  onSearch: (value: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  onAdd,
  onSearch,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter capacity developments..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          className="h-8 w-[150px] lg:w-[250px]"
          onChange={(event) => {
            table.getColumn("name")?.setFilterValue(event.target.value);
            onSearch(event.target.value.trim());
          }}
        />

        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => {
              table.resetColumnFilters();
              onSearch("");
            }}
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <Button type="button" className="h-8" variant="outline" onClick={onAdd}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto hidden h-8 lg:flex"
            >
              <MixerHorizontalIcon className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
