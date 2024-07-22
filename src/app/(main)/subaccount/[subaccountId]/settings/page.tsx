import { SubAccountDetails } from "@/components/forms/sub-account-details";
import { UserDetails } from "@/components/forms/user-details";
import BlurPage from "@/components/global/blur-page";
import { validateRequest } from "@/lib/auth";
import { api } from "@/trpc/server";

type Props = {
  params: {
    subaccountId: string;
  };
};

export default async function SubAccountSettingsPage({ params }: Props) {
  const { user } = await validateRequest();

  if (!user) return null;

  const subAccount = await api.subAccount.getById({ id: params.subaccountId });
  if (!subAccount) return null;

  const agency = await api.agency.getById({ agencyId: subAccount.agencyId });
  if (!agency) return null;

  return (
    <BlurPage>
      <div className="space-y-3">
        <SubAccountDetails
          userId={user.id}
          details={subAccount}
          agencyDetails={agency}
        />
        <UserDetails
          user={user}
          type="subaccount"
          subAccounts={agency.subAccounts}
        />
      </div>
    </BlurPage>
  );
}
