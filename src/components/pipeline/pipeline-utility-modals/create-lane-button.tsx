// ICONS
import { Button } from "@ui/button";
// CUSTOM HOOKS
import { usePipelineDndUtilityModals } from "@/hooks/use-pipeline-utility-modals";
// ICONS
import { Plus } from "lucide-react";

export function CreateLaneButton() {
  const { createLaneModal } = usePipelineDndUtilityModals();

  return (
    <Button className="gap-3" onClick={createLaneModal.open}>
      <Plus className="size-4" />
      <span>Create Lane</span>
    </Button>
  );
}
