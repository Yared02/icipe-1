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
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
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
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { CreateParticipantGrantForm } from "@/components/create-participant-grant-form";

interface DataTableProps<TData, TValue> {
  data: TData[];
  grant: Database["public"]["Tables"]["grants"]["Row"];
}

export function TableParticipants<TData, TValue>({
  data,
  grant,
}: DataTableProps<TData, TValue>) {
  const pathname = usePathname();
  const router = useRouter();

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [createFormOpen, setCreateFormOpen] = React.useState<boolean>(false);

  const columns: ColumnDef<ParticipantGrantWithParticipant>[] = [
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
      cell: ({ row }) => (
        <div>{`${row.original.participant.firstname} ${row.original.participant.surname}`}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => <div>{row.original.participant.phone}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Gender" />
      ),
      cell: ({ row }) => <div>{row.original.participant.gender}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "region",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Region" />
      ),
      cell: ({ row }) => <div>{row.original.participant.region}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "recieved",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Received" />
      ),
      cell: ({ row }) => (
        <div>{`ETB ${new Intl.NumberFormat().format(
          row?.original?.amount ?? 0
        )}`}</div>
      ),
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
                router.push(`${pathname}/${row.original.id}`);
              }}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
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
      />
      {/* @ts-ignore */}
      <DataTable table={table} columns={columns} data={data} />
      <Sheet open={createFormOpen} onOpenChange={setCreateFormOpen}>
        <SheetContent className="min-w-[700px] overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>Add participant to grant</SheetTitle>
            <SheetDescription>
              Enter some participant information
            </SheetDescription>
          </SheetHeader>
          <div className="py-2">
            <CreateParticipantGrantForm
              grant={grant}
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
}

export function DataTableToolbar<TData>({
  table,
  onAdd,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter participants..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

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
