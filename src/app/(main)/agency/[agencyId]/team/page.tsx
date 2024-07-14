// UTILS
import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import { TeamTable } from "@/components/agency/team/team-table";

export default async function TeamPage({
  params,
}: {
  params: { agencyId: string };
}) {
  const agency = await api.agency.getById({ agencyId: params.agencyId });

  if (!agency) return null;

  void api.user.getAgencyAndPermissions.prefetch({
    agencyId: agency.id,
  });

  return <TeamTable agencyId={params.agencyId} />;
}
