"use client";

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
import { CreateParticipantForm } from "./create-participant-form";
import { DataTable } from "@/components/data-table/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  GalleryVerticalEnd,
  GraduationCap,
  HandCoins,
  PlusIcon,
  Smartphone,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DisburseGrantForm } from "./disburse-grant-form";
import { DisburseDeviceForm } from "./disburse-device-form";
import { EnrollCapDevForm } from "./enroll-capdev-form";

interface DataTableProps<TData, TValue> {
  data: TData[];
  programId: string;
}

export function TableParticipants<TData, TValue>({
  data,
  programId,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);
  const [isGrantFormOpen, setIsGrantFormOpen] = useState<boolean>(false);
  const [isDeviceFormOpen, setIsDeviceFormOpen] = useState<boolean>(false);
  const [isCapDevFormOpen, setIsCapDevFormOpen] = useState<boolean>(false);

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const columns: ColumnDef<
    Database["public"]["Tables"]["participants"]["Row"]
  >[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            setSelectedRows((prev) => {
              if (value) {
                return data.map((e: any) => e.id);
              } else {
                return [];
              }
            });
          }}
          aria-label="Select all"
          className={`border-green-500 translate-y-[2px] ${table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate") ? 'bg-green-500' : ''}`}
          />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);

            setSelectedRows((prev) => {
              if (value) {
                return [...prev, row.original.id];
              } else {
                return prev.filter((id) => id !== row.original.id);
              }
            });
          }}
          aria-label="Select row "
          className={`border-green-500 translate-y-[2px] ${row.getIsSelected() ? 'bg-green-500' : ''}`}
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
        <div>{`${row.original.firstname} ${row.original.surname}`}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone" />
      ),
      cell: ({ row }) => <div>{row.original.phone}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Gender" />
      ),
      cell: ({ row }) => <div>{row.getValue("gender")}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "region",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Region" />
      ),
      cell: ({ row }) => <div>{row.getValue("region")}</div>,
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
        defaultGenderParam={params.get("gender") ?? ""}
        onAdd={() => {
          setIsAddFormOpen(true);
        }}
        onGrant={() => {
          setIsGrantFormOpen(true);
        }}
        onDevice={() => {
          setIsDeviceFormOpen(true);
        }}
        onCapDev={() => {
          setIsCapDevFormOpen(true);
        }}
        onParamChange={(key, value) => {
          const params = new URLSearchParams(searchParams);
          if (value) {
            params.set(key, value);
          } else {
            params.delete(key);
          }

          router.replace(`${pathname}?${params.toString()}`);
        }}
      />
      {/* @ts-ignore */}
      <DataTable table={table} columns={columns} data={data} />

      <Sheet open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <SheetContent className="min-w-[700px] overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>Add Participant</SheetTitle>
            <SheetDescription>
              Enter some participant information
            </SheetDescription>
          </SheetHeader>
          <div className="py-2">
            <CreateParticipantForm
              programId={programId}
              onSuccess={(id: number) => {
                setIsAddFormOpen(false);
                router.push(`${pathname}/${id}`);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={isGrantFormOpen} onOpenChange={setIsGrantFormOpen}>
        <SheetContent className="min-w-[700px] overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>Disburse Grant</SheetTitle>
          </SheetHeader>
          <div className="py-2">
            <DisburseGrantForm
              selectedParticipants={selectedRows}
              onSuccess={() => setIsGrantFormOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={isDeviceFormOpen} onOpenChange={setIsDeviceFormOpen}>
        <SheetContent className="min-w-[700px] overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>Disburse Asset</SheetTitle>
          </SheetHeader>
          <div className="py-2">
            <DisburseDeviceForm
              selectedParticipants={selectedRows}
              onSuccess={() => setIsDeviceFormOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={isCapDevFormOpen} onOpenChange={setIsCapDevFormOpen}>
        <SheetContent className="min-w-[700px] overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>Enroll In Capacity Development</SheetTitle>
          </SheetHeader>
          <div className="py-2">
            <EnrollCapDevForm
              selectedParticipants={selectedRows}
              onSuccess={() => setIsCapDevFormOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  defaultGenderParam: string;
  onAdd: () => void;
  onGrant: () => void;
  onDevice: () => void;
  onCapDev: () => void;
  onParamChange: (key: string, value: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  onAdd,
  onGrant,
  onDevice,
  onCapDev,
  onParamChange,
  defaultGenderParam,
}: DataTableToolbarProps<TData>) {
  const [gender, setGender] = useState<string>(defaultGenderParam);
  const [isFiltered, setIsFiltered] = useState<boolean>(
    defaultGenderParam !== ""
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter participants..."
          className="h-8 w-[150px] lg:w-[250px]"
          onChange={(event) => {
            onParamChange("search", event.target.value.trim());
            setIsFiltered(true);
          }}
        />

        <Select
          value={gender}
          onValueChange={(value) => {
            setGender(value);
            onParamChange("gender", value);
            setIsFiltered(true);
          }}
        >
          <SelectTrigger className="w-[150px] text-sm h-8 font-semibold tracking-wide border-dashed">
            <GalleryVerticalEnd className="h-4 w-4" />
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => {
              table.resetColumnFilters();
              onParamChange("search", "");
              onParamChange("gender", "");

              setIsFiltered(false);
              setGender("");
            }}
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex space-x-2 items-center">
        <Button type="button" className="h-8" variant="outline" onClick={onAdd}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Participant
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
