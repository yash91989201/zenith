// UTILS
import { api } from "@/trpc/server";
import { validateRequest } from "@/lib/auth";
// CUSTOM COMPONENTS
import { UserDetails } from "@forms/user-details";
import { AgencyDetails } from "@forms/agency-details";

export default async function SettingsPage({
  params,
}: {
  params: { agencyId: string };
}) {
  const { user } = await validateRequest();
  if (!user) return null;

  const agencyId = params.agencyId;
  const agency = await api.agency.getById({ agencyId });

  if (!agency) return null;

  return (
    <div className="flex flex-col gap-3">
      <UserDetails type="agency" user={user} subAccounts={agency.subAccounts} />
      <AgencyDetails data={agency} />
    </div>
  );
}
