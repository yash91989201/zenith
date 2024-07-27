import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
// UI
import { Button } from "@ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@ui/dialog";
// CUSTOM COMPONENTS
import { FunnelForm } from "@/components/funnel/funnel-form";
// ICONS
import { PlusCircle } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";

type Props = {
  subAccountId: string;
};

export function CreateFunnelButton({ subAccountId }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-3">
          <PlusCircle className="size-4" />
          <span>Create Funnel</span>
        </Button>
      </DialogTrigger>
      <VisuallyHidden.Root>
        <DialogHeader>
          <DialogTitle>Create funnel dialog</DialogTitle>
        </DialogHeader>
      </VisuallyHidden.Root>
      <DialogContent>
        <FunnelForm subAccountId={subAccountId} modalChild />
      </DialogContent>
    </Dialog>
  );
}
