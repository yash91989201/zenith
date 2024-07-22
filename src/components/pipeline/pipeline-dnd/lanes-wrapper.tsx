import React, { forwardRef, memo, type ReactNode, useEffect } from "react";
import { autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
// CUSTOM HOOKS
import { usePipelineDnd } from "@/hooks/use-pipeline-dnd";
// UI
import { ScrollArea, ScrollBar } from "@ui/scroll-area";

type LanesWrapperProps = {
  children: ReactNode;
};

const LanesWrapper = forwardRef<HTMLDivElement, LanesWrapperProps>(
  ({ children }: LanesWrapperProps, ref) => {
    const { instanceId } = usePipelineDnd();

    useEffect(() => {
      return autoScrollWindowForElements({
        canScroll: ({ source }) => source.data.instanceId === instanceId,
      });
    }, [instanceId]);

    return (
      <ScrollArea className="whitespace-nowrap rounded-md border" ref={ref}>
        <div className="flex w-full gap-3 p-3 pb-6">{children}</div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  },
);

LanesWrapper.displayName = "Lanes wrapper";

export default memo(LanesWrapper);
