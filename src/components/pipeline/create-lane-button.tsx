import { Button } from "@/components/ui/button";
import { usePipelineDnd } from "@/hooks/use-pipeline-dnd";
import { Plus } from "lucide-react";

export function CreateLaneButton() {
  const { createLaneModal } = usePipelineDnd();

  return (
    <Button className="gap-3" onClick={createLaneModal.open}>
      <Plus className="size-4" />
      <span>Create Lane</span>
    </Button>
  );
}
