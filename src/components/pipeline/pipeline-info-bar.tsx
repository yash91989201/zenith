"use client";
import Link from "next/link";
import { useState } from "react";
// UTILS
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
// CUSTOM HOOKS
import { useToggle } from "@/hooks/use-toggle";
import { usePipelineDndUtilityModals } from "@/hooks/use-pipeline-utility-modals";
// UI
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@ui/command";
import { Button } from "@ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
// ICONS
import { Check, ChevronsUpDown, Plus } from "lucide-react";

type Props = {
  subAccountId: string;
  pipelineId: string;
};

export function PipelineInfoBar({ subAccountId, pipelineId }: Props) {
  const pipelinePopup = useToggle(false);
  const { createPipelineModal } = usePipelineDndUtilityModals();

  const [selectedPipelineId, setSelectedPipelineId] = useState(pipelineId);

  const { data: pipelines = [] } = api.pipeline.getSubAccountPipelines.useQuery(
    {
      subAccountId,
    },
  );

  return (
    <Popover open={pipelinePopup.isOpen} onOpenChange={pipelinePopup.toggle}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={pipelinePopup.isOpen}
          className="w-48 justify-between text-black hover:bg-white"
        >
          {pipelines.find((pipeline) => pipeline.id === selectedPipelineId)
            ?.name ?? "Select a pipeline..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0">
        <Command>
          <CommandEmpty>No pipelines found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {pipelines.map((pipeline) => (
                <Link
                  key={pipeline.id}
                  href={`/subaccount/${subAccountId}/pipelines/${pipeline.id}`}
                >
                  <CommandItem
                    key={pipeline.id}
                    value={pipeline.id}
                    onSelect={(currentValue) => {
                      setSelectedPipelineId(currentValue);
                      pipelinePopup.close();
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedPipelineId === pipeline.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {pipeline.name}
                  </CommandItem>
                </Link>
              ))}
              <Button
                variant="ghost"
                className="mt-4 flex w-full gap-2"
                onClick={createPipelineModal.open}
              >
                <Plus className="size-4" />
                Create Pipeline
              </Button>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
