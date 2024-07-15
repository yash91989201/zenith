"use client";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
// UTILS
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
// TYPES
import type { ColumnDef } from "@tanstack/react-table";
import type { TeamTableType, UserType } from "@/lib/types";
// CUSTOM HOOKS
import { useUser } from "@/hooks/use-user";
import { useToggle } from "@/hooks/use-toggle";
// UI
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ui/alert-dialog";
import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
// CUSTOM COMPONENTS
import { UserDetails } from "@forms/user-details";
// ICONS
import { MoreVertical, Plus, Search } from "lucide-react";
import { SendInvitation } from "@/components/agency/team/send-invitation";

export function TeamTable({ agencyId }: { agencyId: string }) {
  const { user } = useUser();
  const router = useRouter();
  const [actionRow, setActionRow] = useState<TeamTableType | null>(null);

  const userEditModal = useToggle(false);
  const userDeleteModal = useToggle(false);
  const inviteUserDialog = useToggle(false);

  const { data = [] } = api.user.getAgencyAndPermissions.useQuery({ agencyId });

  const { mutateAsync: deleteUser } = api.user.delete.useMutation();
  const { mutateAsync: saveActivityLog } =
    api.notification.saveActivityLog.useMutation();

  const openUserEditModal = (rowData: TeamTableType) => {
    setActionRow(rowData);
    userEditModal.open();
  };

  const openUserDeleteModal = (rowData: TeamTableType) => {
    setActionRow(rowData);
    userDeleteModal.open();
  };

  const columns = getTeamTableColumns(openUserEditModal, openUserDeleteModal);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-md border-b bg-white px-3 py-1.5">
            <Search className="size-4" />
            <input
              className="flex h-9 w-full border-none bg-transparent  py-1 text-sm outline-none  placeholder:text-muted-foreground focus-visible:outline-none"
              placeholder="Search Name..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => {
                table.getColumn("name")?.setFilterValue(event.target.value);
              }}
            />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-3">
                <Plus className="size-4" />
                <span>Invite User</span>
              </Button>
            </DialogTrigger>
            <VisuallyHidden.Root>
              <DialogHeader>
                <DialogTitle>Invite user dialog</DialogTitle>
              </DialogHeader>
            </VisuallyHidden.Root>
            <DialogContent>
              <SendInvitation
                agencyId={user?.agencyId ?? ""}
                modalChild
                onClose={inviteUserDialog.close}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-lg border bg-background">
          <Table>
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
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No Results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={userEditModal.isOpen} onOpenChange={userEditModal.toggle}>
        <DialogContent>
          <VisuallyHidden.Root>
            <DialogTitle>Update user details for team table</DialogTitle>
          </VisuallyHidden.Root>
          <UserDetails
            modalChild
            type="agency"
            onClose={userEditModal.close}
            user={actionRow as Partial<UserType>}
            subAccounts={actionRow?.agency?.subAccounts}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={userDeleteModal.isOpen}
        onOpenChange={userDeleteModal.toggle}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-left">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              This action cannot be undone. This will permanently delete the
              user and related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive"
              disabled={actionRow?.id === user?.id}
              onClick={async () => {
                if (!actionRow) return;
                const deleteUserRes = await deleteUser({
                  userId: actionRow.id,
                });
                if (deleteUserRes.status === "SUCCESS") {
                  await saveActivityLog({
                    activity: `Removed user | ${actionRow.name}`,
                    agencyId: actionRow.agencyId ?? undefined,
                  });
                  userDeleteModal.close();
                  router.refresh();
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const getTeamTableColumns = (
  openUserEditModal: (rowData: TeamTableType) => void,
  openUserDeleteModal: (rowData: TeamTableType) => void,
): ColumnDef<TeamTableType>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        <div className="relative h-11 w-11 flex-none">
          <Image
            src={row.original.avatarUrl}
            fill
            className="rounded-full object-cover"
            alt="avatar image"
          />
        </div>
        <span>{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "SubAccount",
    header: "Owned Accounts",
    cell: ({ row }) => {
      const isAgencyOwner = row.original.role === "AGENCY_OWNER";
      const ownedAccounts = row.original.permissions.filter(
        (perm) => perm.access,
      );

      if (isAgencyOwner)
        return (
          <div className="flex flex-col items-start">
            <div className="flex flex-col gap-2">
              <Badge className="whitespace-nowrap bg-slate-600">
                Agency - {row.original.agency?.name}
              </Badge>
            </div>
          </div>
        );
      return (
        <div className="flex flex-col items-start">
          <div className="flex flex-col gap-2">
            {ownedAccounts?.length ? (
              ownedAccounts.map((account) => (
                <Badge
                  key={account.id}
                  className="w-fit whitespace-nowrap bg-slate-600"
                >
                  Sub Account - {account.subAccount?.name}
                </Badge>
              ))
            ) : (
              <div className="text-muted-foreground">No Access Yet</div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return (
        <Badge
          className={cn(
            row.original.role === "AGENCY_OWNER" && "bg-emerald-500",
            row.original.role === "AGENCY_ADMIN" && "bg-orange-400",
            row.original.role === "SUBACCOUNT_USER" && "bg-primary",
            row.original.role === "SUBACCOUNT_GUEST" && "bg-muted",
          )}
        >
          {row.original.role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "action",
    header: "",
    cell: ({ row }) => {
      if (row.original.role === "AGENCY_OWNER") return null;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openUserEditModal(row.original)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openUserDeleteModal(row.original)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
