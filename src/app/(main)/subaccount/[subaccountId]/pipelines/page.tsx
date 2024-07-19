import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

type Props = {
  params: { subaccountId: string };
};

export default async function PipelinesPage({ params }: Props) {
  const pipeline = await api.pipeline.getBySubAccountId({
    subAccountId: params.subaccountId,
  });

  if (pipeline) {
    return redirect(
      `/subaccount/${params.subaccountId}/pipelines/${pipeline.id}`,
    );
  }

  const createPipelineRes = await api.pipeline.create({
    name: "First pipeline",
    subAccountId: params.subaccountId,
  });

  if (createPipelineRes.status === "SUCCESS") {
    return redirect(
      `/subaccount/${params.subaccountId}/pipelines/${createPipelineRes?.data?.id}`,
    );
  }

  return <></>;
}
