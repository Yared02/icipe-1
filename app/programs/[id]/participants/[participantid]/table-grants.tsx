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
import { DataTable } from "@/components/data-table/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Cross2Icon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { CreateParticipantGrantForm } from "@/components/create-participant-grant-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface DataTableProps<TData, TValue> {
  participantId: string;
  data: TData[];
}

export function TableGrants<TData, TValue>({
  participantId,
  data,
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

  const handleDelete = async (grantId: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      const supabase = createClient();

      const result = await supabase
        .from("participant_grants")
        .delete()
        .eq("grant_id", grantId)
        .eq("participant_id", participantId);

      if (result.error) {
        alert("Failed to delete record");
        return;
      }

      if (result.status === 204) {
        toast.success("Participant grant deleted successfully");
      }

      router.refresh();
    }
  };

  const columns: ColumnDef<Database["public"]["Tables"]["grants"]["Row"]>[] = [
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
      accessorKey: "total_amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Amount" />
      ),

      cell: ({ row }) => (
        <div>{`ETB ${new Intl.NumberFormat().format(
          row.original.total_amount ?? 0
        )}`}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "from",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="From" />
      ),
      cell: ({ row }) => <div>{row.original.from}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "to",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="To" />
      ),
      cell: ({ row }) => <div>{row.original.to}</div>,
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
            params.set("grants", value);
          } else {
            params.delete("grants");
          }

          router.replace(`${pathname}?${params.toString()}`);
        }}
      />
      <div className="rounded-md border">
        {/* @ts-ignore */}
        <DataTable table={table} columns={columns} data={data} />
      </div>
      <Sheet open={createFormOpen} onOpenChange={setCreateFormOpen}>
        <SheetContent className="min-w-[700px] overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>Add Participant to grant</SheetTitle>
            <SheetDescription>Search for grants</SheetDescription>
          </SheetHeader>
          <div className="py-2">
            <CreateParticipantGrantForm
              participantId={participantId}
              onSuccess={() => {
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
          placeholder="Filter grants..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("name")?.setFilterValue(event.target.value);
            onSearch(event.target.value.trim());
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              onSearch("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}

        <Button type="button" className="h-8" variant="outline" onClick={onAdd}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add
        </Button>
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
