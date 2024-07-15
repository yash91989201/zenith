// UTILS
import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import BlurPage from "@global/blur-page";
import { MediaComponent } from "@/components/sub-account/media";

type Props = {
  params: {
    subaccountId: string;
  };
};

export default async function MediaPage({ params }: Props) {
  await api.media.getSubAccountMedia.prefetch({
    subAccountId: params.subaccountId,
  });

  return (
    <BlurPage>
      <MediaComponent subAccountId={params.subaccountId} />
    </BlurPage>
  );
}
