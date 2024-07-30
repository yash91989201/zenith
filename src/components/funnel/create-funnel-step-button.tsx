"use client";
// CUSTOM HOOKS
import { useToggle } from "@/hooks/use-toggle";
// UI
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Button } from "@ui/button";
// CUSTOM COMPONENTS
import { FunnelPageForm } from "@/components/funnel/funnel-page-form";
// ICONS
import { PlusCircle } from "lucide-react";

type Props = {
  funnelId: string;
  subAccountId: string;
};

export function CreateFunnelStepButton({ funnelId, subAccountId }: Props) {
  const funnelStepModal = useToggle();

  return (
    <Dialog open={funnelStepModal.isOpen} onOpenChange={funnelStepModal.toggle}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="gap-1.5">
          <PlusCircle className="size-4" />
          <span>Create funnel page</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create funnel page</DialogTitle>
          <DialogDescription>
            You can create a page for funnel and sell products within
          </DialogDescription>
        </DialogHeader>
        <FunnelPageForm
          modalChild
          funnelId={funnelId}
          subAccountId={subAccountId}
          onClose={funnelStepModal.close}
        />
      </DialogContent>
    </Dialog>
  );
}
