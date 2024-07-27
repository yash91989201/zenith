// TYPES
import type { FunnelPageType, FunnelType } from "@/lib/types";

type Props = {
  funnel: FunnelType;
  funnelId: string;
  subAccountId: string;
  pages: FunnelPageType[];
};

export function FunnelSteps({}: Props) {
  return <>funnel steps</>;
}
