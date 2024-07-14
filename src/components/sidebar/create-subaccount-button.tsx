"use client";
// UTILS
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
// TYPES
import type { AgencyType } from "@/lib/types";
// CUSTOM HOOKS
import { useToggle } from "@hooks/use-toggle";
// UI
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import { Button } from "@ui/button";
// CUSTOM COMPONENTS
import { SubAccountDetails } from "@forms/sub-account-details";
// ICONS
import { PlusCircleIcon } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";

export function CreateSubAccountButton({ className }: { className?: string }) {
  const createSubAccountModal = useToggle(false);

  const { data, isLoading } = api.user.getDetails.useQuery({});

  return (
    <>
      <Button
        className={cn("gap-3", className)}
        onClick={createSubAccountModal.open}
      >
        <PlusCircleIcon className="size-5 " />
        Create Subaccount
      </Button>

      <Dialog
        open={createSubAccountModal.isOpen}
        onOpenChange={createSubAccountModal.toggle}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create a sub account</DialogTitle>
            <DialogDescription>
              You can switch between sub accounts
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <div className="my-6 flex flex-col items-center justify-center gap-6 text-muted-foreground">
              <ReloadIcon className="size-12 animate-spin" />
              <p>Loading form data for Creating Sub account ...</p>
            </div>
          ) : (
            <SubAccountDetails
              agencyDetails={data?.agency as AgencyType}
              userId={data?.id ?? ""}
              userName={data?.name ?? ""}
              closeModal={createSubAccountModal.close}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
