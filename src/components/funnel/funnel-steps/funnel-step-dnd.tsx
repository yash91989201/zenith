// CUSTOM HOOKS
import { useFunnelSteps } from "@/hooks/useFunnelSteps";
// CUSTOM COMPONENTS
import { FunnelStep } from "@funnelSteps/funnel-step";

export function FunnelStepDnd() {
  const { pages } = useFunnelSteps();

  return pages.map((page) => <FunnelStep key={page.id} page={page} />);
}
