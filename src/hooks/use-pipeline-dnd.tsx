import invariant from "tiny-invariant";
// PROVIDERS
import { PipelineDndContext } from "@/providers/pipeline-dnd-provider";
// TYPES
import type { PipelineDndContextType } from "@/providers/pipeline-dnd-provider";

import { useContext } from "react";

export function usePipelineDnd(): PipelineDndContextType {
  const value = useContext(PipelineDndContext);
  invariant(value, "cannot find PipelineDndContext provider");

  return value;
}
