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

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

import { Cross2Icon, DotsHorizontalIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { PlusIcon } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { CreateDeviceForm } from "./create-device-form";
import { DataTable } from "@/components/data-table/data-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

interface DataTableProps<TData, TValue> {
  data: TData[];
  programId: string;
}

export function TableDevices<TData, TValue>({
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
  const [createFormOpen, setCreateFormOpen] = React.useState<boolean>(false);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this device?")) {
      return;
    }

    const supabase = createClient();

    const result = await supabase.from("devices").delete().eq("id", id);

    if (result.error) {
      alert("An error occurred while deleting the device");
      console.log(result.error);
      return;
    }

    if (result.status === 204) {
      toast.success("Device deleted successfully");
      router.refresh();
    }
  };

  const columns: ColumnDef<Database["public"]["Tables"]["devices"]["Row"]>[] = [
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
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Amount" />
      ),
      cell: ({ row }) => <div>{row.original.amount}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "operating_system",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Operating System" />
      ),
      cell: ({ row }) => <div>{row.original.operating_system}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "model",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Model" />
      ),
      cell: ({ row }) => <div>{row.original.model}</div>,
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
          setCreateFormOpen(true);
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
      <Sheet open={createFormOpen} onOpenChange={setCreateFormOpen}>
        <SheetContent className="min-w-[700px] overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>Add Grant</SheetTitle>
            <SheetDescription>Enter some grant information</SheetDescription>
          </SheetHeader>
          <div className="py-2">
            <CreateDeviceForm
              programId={programId}
              onSuccess={() => {
                toast.success("Asset created successfully");
                setCreateFormOpen(false);
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
          placeholder="Filter devices..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          className="h-8 w-[150px] lg:w-[250px]"
          onChange={(event) => {
            table.getColumn("name")?.setFilterValue(event.target.value);
            onSearch(event.target.value.trim());
          }}
        />

        <Button type="button" className="h-8" variant="outline" onClick={onAdd}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add
        </Button>

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
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
