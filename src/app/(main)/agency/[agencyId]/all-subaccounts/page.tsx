import Link from "next/link";
import Image from "next/image";
// UTILS
import { api } from "@/trpc/server";
import { validateRequest } from "@/lib/auth";
// UI
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/command";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/alert-dialog";
import { Button } from "@ui/button";
// CUSTOM COMPONENTS
import { DeleteSubAccountButton } from "@forms/delete-sub-account-button";
import { CreateSubAccountButton } from "@/components/sidebar/create-subaccount-button";

export default async function AllSubAccountsPage() {
  const { user } = await validateRequest();
  if (!user) return;

  const userDetails = await api.user.getDetails({});

  return (
    <div className="flex flex-col gap-3">
      <CreateSubAccountButton className="m-6 max-w-xs self-end" />
      <Command className="bg-transparent ">
        <CommandInput placeholder="Search accounts" />
        <CommandList>
          <CommandEmpty>No sub accounts found</CommandEmpty>

          <CommandGroup heading="Sub accounts" className="space-y-3">
            {!!userDetails?.agency?.subAccounts.length ? (
              userDetails.agency.subAccounts.map((subAccount) => (
                <CommandItem
                  key={subAccount.id}
                  className="mb-3 h-32 cursor-pointer rounded-lg border border-border bg-background p-3 text-primary transition-all hover:bg-primary"
                >
                  <Link
                    href={`/subaccount/${subAccount.id}`}
                    className="flex h-full w-full gap-4"
                  >
                    <div className="relative w-32">
                      <Image
                        src={subAccount.subAccountLogo}
                        alt="subAccount logo"
                        fill
                        className="rounded-md bg-muted/50 object-contain p-4"
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div className="flex flex-col">
                        {subAccount.name}
                        <span className="text-xs text-muted-foreground">
                          {subAccount.address}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the subaccount and all
                          related resources. This action is permanent, tread
                          with caution !!
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <DeleteSubAccountButton
                            subAccountId={subAccount.id}
                          />
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CommandItem>
              ))
            ) : (
              <div className="p-3 text-center text-muted-foreground">
                No sub accounts found
              </div>
            )}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
