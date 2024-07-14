"use client";
import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { PopoverTrigger } from "@radix-ui/react-popover";
// UTILS
import { cn } from "@/lib/utils";
import { buttonVariants } from "@ui/button";
// TYPES
import type {
  AgencySidebarOptionType,
  AgencyType,
  SubAccountSidebarOptionType,
  SubAccountType,
} from "@/lib/types";
import type { AppRouter } from "@/server/api/root";
// UI
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@ui/sheet";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/command";
import { Button } from "@ui/button";
import { Separator } from "@ui/separator";
import { AspectRatio } from "@ui/aspect-ratio";
import { Popover, PopoverContent } from "@ui/popover";
// CUSTOM COMPONENTS
import { CreateSubAccountButton } from "@/components/sidebar/create-subaccount-button";
// ICONS
import { Icons } from "@global/icons";
import { ChevronsUpDown, Compass, Menu } from "lucide-react";

type MenuOptionsProps = {
  id: string;
  user: Awaited<ReturnType<AppRouter["user"]["getDetails"]>>;
  details: AgencyType | SubAccountType;
  sidebarLogo: string;
  defaultOpen?: boolean;
  subAccounts: SubAccountType[];
  sidebarOptions: AgencySidebarOptionType[] | SubAccountSidebarOptionType[];
};

export function MenuOptions({
  user,
  details,
  sidebarLogo,
  defaultOpen,
  subAccounts,
  sidebarOptions,
}: MenuOptionsProps) {
  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen],
  );

  return (
    <Sheet modal={false} open={openState?.open}>
      <SheetTrigger
        asChild
        className="absolute left-4 top-4 z-50 flex md:hidden"
      >
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        showCloseButton={!defaultOpen}
        className={cn(
          "fixed top-0 border-r bg-background/80 p-6 backdrop:blur-xl",
          defaultOpen
            ? "z-30 hidden w-80 md:inline-block"
            : "z-50 inline-block w-full md:hidden",
        )}
      >
        <div>
          <AspectRatio ratio={16 / 5} className="relative">
            <Image
              src={sidebarLogo}
              alt="sidebar logo"
              fill
              className="rounded-md object-contain"
            />
          </AspectRatio>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="my-6 flex h-fit w-full items-center justify-start gap-3"
              >
                <div className="flex items-center gap-3 text-left">
                  <Compass />
                  <div className="flex flex-col">
                    <SheetTitle>{details.name}</SheetTitle>
                    <SheetDescription className="text-xs text-muted-foreground">
                      {details.address}
                    </SheetDescription>
                  </div>
                </div>
                <div>
                  <ChevronsUpDown className="size-4 text-muted-foreground" />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="mt-4 h-96 w-80" align="start">
              <Command className="rounded-lg ">
                <CommandInput placeholder="Search accounts" />
                <CommandList className="my-1.5 pb-16 ">
                  <CommandEmpty>No accounts found</CommandEmpty>
                  {["AGENCY_OWNER", "AGENCY_ADMIN"].includes(
                    user?.role ?? "",
                  ) &&
                    user?.agency && (
                      <CommandGroup>
                        <CommandItem className="my-2 cursor-pointer rounded-md border border-border bg-transparent p-3 text-primary transition-all hover:bg-muted">
                          {defaultOpen ? (
                            <Link
                              href={`/agency/${user?.agency?.id}`}
                              className="flex h-full w-full gap-3"
                            >
                              <div className="relative w-16">
                                <Image
                                  src={user?.agency?.agencyLogo ?? ""}
                                  alt="agency logo"
                                  fill
                                  className="rounded-md object-contain"
                                />
                              </div>
                              <div className="flex flex-col">
                                {user?.agency?.name}
                                <span>{user?.agency?.address}</span>
                              </div>
                            </Link>
                          ) : (
                            <SheetClose asChild>
                              <Link
                                href={`/agency/${user?.agency?.id}`}
                                className="flex h-full w-full gap-3"
                              >
                                <div className="relative w-16">
                                  <Image
                                    src={user?.agency?.agencyLogo}
                                    alt="agency logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  {user?.agency?.name}
                                  <span>{user?.agency?.address}</span>
                                </div>
                              </Link>
                            </SheetClose>
                          )}
                        </CommandItem>
                      </CommandGroup>
                    )}
                  <CommandGroup heading="Accounts">
                    {subAccounts.length > 0 ? (
                      subAccounts.map((subAccount) => (
                        <CommandItem key={subAccount.id}>
                          {defaultOpen ? (
                            <Link
                              href={`/subaccount/${subAccount.id}`}
                              className="flex h-full w-full gap-3"
                            >
                              <div className="relative w-16">
                                <Image
                                  src={subAccount.subAccountLogo}
                                  alt="agency logo"
                                  fill
                                  className="rounded-md object-contain"
                                />
                              </div>
                              <div className="flex flex-col">
                                {subAccount.name}
                                <span>{subAccount.address}</span>
                              </div>
                            </Link>
                          ) : (
                            <SheetClose asChild>
                              <Link
                                href={`/subaccount/${subAccount.id}`}
                                className="flex h-full w-full gap-3"
                              >
                                <div className="relative w-16">
                                  <Image
                                    src={subAccount.subAccountLogo ?? ""}
                                    alt="agency logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  {subAccount.name}
                                  <span>{subAccount.address}</span>
                                </div>
                              </Link>
                            </SheetClose>
                          )}
                        </CommandItem>
                      ))
                    ) : (
                      <span className="p-2 text-xs text-muted-foreground">
                        No accounts
                      </span>
                    )}
                  </CommandGroup>
                </CommandList>
                {["AGENCY_OWNER", "AGENCY_ADMIN"].includes(
                  user?.role ?? "",
                ) && <CreateSubAccountButton />}
              </Command>
            </PopoverContent>
          </Popover>
          <p className="mb-2 text-xs text-muted-foreground">Menu links</p>
          <Separator className="mb-4" />
          <nav className="relative">
            <Command className="overflow-visible rounded-lg bg-transparent">
              <CommandInput
                placeholder="Search"
                className="rounded-md dark:bg-muted"
              />
              <CommandList className="overflow-visible pb-16">
                <CommandEmpty>No result found</CommandEmpty>
                <CommandGroup className="my-3 overflow-visible">
                  {sidebarOptions.map((sidebarOption) => (
                    <CommandItem
                      asChild
                      key={sidebarOption.id}
                      className="w-full rounded data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground"
                    >
                      <Link
                        href={sidebarOption.link}
                        className={cn(
                          buttonVariants({
                            variant: "ghost",
                          }),
                          "w-full justify-start gap-3",
                        )}
                      >
                        {Icons[sidebarOption.icon]}
                        <span>{sidebarOption.name}</span>
                      </Link>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
