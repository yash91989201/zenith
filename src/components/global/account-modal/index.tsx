"use client";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
// CUSTOM HOOKS
import { useAccountModal } from "@/hooks/use-account-modal";
// UI
import { Button } from "@ui/button";
// CUSTOM COMPONENTS
import { ProfileTab } from "@accountModal/profile-tab";
import { SecurityTab } from "@accountModal/security-tab";
// ICONS
import { ShieldCheck, UserCircle2, X } from "lucide-react";

export function AccountModal() {
  const { open, onOpenChange, closeModal } = useAccountModal();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid min-h-[44rem] w-full max-w-xs translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] dark:bg-dark-tremor-background-subtle sm:rounded-lg md:w-[88vw] md:max-w-4xl">
          <Tabs.Root className="relative flex " defaultValue="profile">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-auto"
              onClick={closeModal}
            >
              <X className="size-4" />
            </Button>
            <Tabs.List
              className="w-1/4 shrink-0 space-y-6 border-r bg-gray-100 p-6 shadow-lg dark:bg-dark-tremor-background-subtle sm:rounded-lg"
              aria-label="Manage your account"
            >
              <div className="space-y-1.5">
                <Dialog.Title className="font-bold md:text-lg lg:text-2xl">
                  Account
                </Dialog.Title>
                <Dialog.Description className="text-sm text-tremor-content-subtle">
                  Manage your account info.
                </Dialog.Description>
              </div>
              <div className="flex flex-col gap-3">
                <Tabs.Trigger
                  className=" inline-flex items-center justify-start gap-3 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow"
                  value="profile"
                >
                  <UserCircle2 className="size-4 " />
                  <span>Profile</span>
                </Tabs.Trigger>
                <Tabs.Trigger
                  className="inline-flex items-center justify-start gap-3 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow"
                  value="security"
                >
                  <ShieldCheck className="size-4" />
                  <span>Security</span>
                </Tabs.Trigger>
              </div>
            </Tabs.List>
            <ProfileTab />
            <SecurityTab />
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
