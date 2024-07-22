import { useContext } from "react";
import invariant from "tiny-invariant";
// TYPES
import type { LaneContextProps } from "@/providers/lane-provider";
// PROVIDERS
import { LaneContext } from "@/providers/lane-provider";

export function useLane(): LaneContextProps {
  const value = useContext(LaneContext);
  invariant(value, "cannot find LaneContext provider");
  return value;
}
