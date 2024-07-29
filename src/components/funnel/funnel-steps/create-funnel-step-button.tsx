// UTILS
import { api } from "@/trpc/react";
// CUSTOM HOOKS
import { useToggle } from "@/hooks/use-toggle";
import { useFunnelSteps } from "@/hooks/useFunnelSteps";
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

export function CreateFunnelStepButton() {
  const apiUtils = api.useUtils();
  const funnelStepModal = useToggle();
  const { funnelId, subAccountId } = useFunnelSteps();

  const onClose = () => {
    void apiUtils.funnelPage.getAll.refetch({ funnelId });

    funnelStepModal.close();
  };

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
          onClose={onClose}
          subAccountId={subAccountId}
          funnelId={funnelId}
        />
      </DialogContent>
    </Dialog>
  );
}
