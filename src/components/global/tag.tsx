import React from "react";
import { cn } from "@/lib/utils";
import type { TagColor } from "@/lib/types";

type Props = {
  title?: string;
  colorName: TagColor;
  children?: React.ReactElement;
};

export function Tag({ colorName, title, children }: Props) {
  return (
    <div
      key={colorName}
      className={cn(
        colorName === "BLUE" && "bg-[#57acea]/10 text-[#57acea]",
        colorName === "ORANGE" && "bg-[#ffac7e]/10 text-[#ffac7e]",
        colorName === "ROSE" && "bg-rose-500/10 text-rose-500",
        colorName === "GREEN" && "bg-emerald-400/10 text-emerald-400",
        colorName === "PURPLE" && "bg-purple-400/10 text-purple-400",
        colorName === "BLUE" && !title && "border-[1px] border-[#57acea]",
        colorName === "ORANGE" && !title && "border-[1px] border-[#ffac7e]",
        colorName === "ROSE" && !title && "border-[1px] border-rose-500",
        colorName === "GREEN" && !title && "border-[1px] border-emerald-400",
        colorName === "PURPLE" && !title && "border-[1px] border-purple-400",
        "inline-flex flex-shrink-0 cursor-pointer items-center rounded-sm p-2 text-xs",
      )}
    >
      {title}
      {children ?? children}
    </div>
  );
}
