// CUSTOM COMPONENTS
import BlurPage from "@global/blur-page";
import { FunnelTable } from "@/components/funnel/funnel-table";

type Props = {
  params: {
    subaccountId: string;
  };
};

export default function FunnelsPage({ params }: Props) {
  return (
    <BlurPage>
      <FunnelTable subAccountId={params.subaccountId} />
    </BlurPage>
  );
}
