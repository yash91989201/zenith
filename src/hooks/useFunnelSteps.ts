import { useContext } from "react";
import invariant from "tiny-invariant";
// PROVIDERS
import { FunnelStepsContext } from "@/providers/funnel-steps-provider";
// TYPES
import type { FunnelStepsContextType } from "@/providers/funnel-steps-provider";


export function useFunnelSteps(): FunnelStepsContextType {
  const value = useContext(FunnelStepsContext);
  invariant(value, "cannot find FunnelStepsContext provider");

  return value;
}
