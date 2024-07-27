"use client";
import React from "react";
import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
// UTILS
import { api } from "@/trpc/react";
// TYPES
import type { ColumnDef } from "@tanstack/react-table";
import type { FunnelWithPagesType } from "@/lib/types";
// UI
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import { Badge } from "@ui/badge";
// CUSTOM COMPONENTS
import { CreateFunnelButton } from "@/components/funnel/create-funnel-button";
// ICONS
import { Search } from "lucide-react";
import { ExternalLink } from "lucide-react";

type Props = {
  subAccountId: string;
};

export function FunnelTable({ subAccountId }: Props) {
  const { data = [] } = api.funnel.getAll.useQuery({ subAccountId });

  const table = useReactTable({
    data,
    columns: FUNNEL_TABLE_COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-md border-b bg-white px-3  py-1.5 dark:bg-muted">
          <Search className="size-4 dark:text-muted-foreground" />
          <input
            className="flex h-9 w-full border-none bg-transparent py-1 text-sm outline-none  placeholder:text-muted-foreground focus-visible:outline-none"
            placeholder="Search funnel by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              table.getColumn("name")?.setFilterValue(event.target.value);
            }}
          />
        </div>
        <CreateFunnelButton subAccountId={subAccountId} />
      </div>
      <div className=" rounded-lg border bg-background">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={FUNNEL_TABLE_COLUMNS.length}
                  className="h-24 text-center"
                >
                  No Results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export const FUNNEL_TABLE_COLUMNS: ColumnDef<FunnelWithPagesType>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link
          className="flex items-center gap-2"
          href={`/subaccount/${row.original.subAccountId}/funnels/${row.original.id}`}
        >
          {row.original.name}
          <ExternalLink size={15} />
        </Link>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {format(new Date(row.original.updatedAt), "KK b, MMM yyyy")}
      </span>
    ),
  },
  {
    accessorKey: "published",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.published;
      return status ? (
        <Badge variant="default">Live - {row.original.subDomainName}</Badge>
      ) : (
        <Badge variant="secondary">Draft</Badge>
      );
    },
  },
];
