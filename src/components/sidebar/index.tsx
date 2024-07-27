// UTILS
import { api } from "@/trpc/server";
// CUSTOM COMPONENTS
import { MenuOptions } from "@/components/sidebar/menu-options";

type SidebarProps = {
  id: string;
  type: "agency" | "subaccount";
};

export async function Sidebar({ id, type }: SidebarProps) {
  const user = await api.user.getDetails({});

  if (!user) return;
  if (!user.agencyId) return;

  const details =
    type === "agency"
      ? user?.agency
      : user?.agency?.subAccounts?.find((subAccount) => subAccount.id === id);

  const isWhiteLabelAgency = user?.agency?.whiteLabel;

  if (!details) return;

  let sidebarLogo = user?.agency?.agencyLogo ?? "/assets/zenith-logo.svg";

  if (isWhiteLabelAgency) {
    if (type === "subaccount") {
      sidebarLogo =
        user.agency?.subAccounts?.find((subAccount) => subAccount.id === id)
          ?.subAccountLogo ??
        user.agency?.agencyLogo ??
        "";
    }
  }

  const sidebarOptions =
    type === "agency"
      ? (user.agency?.sidebarOptions ?? [])
      : (user.agency?.subAccounts?.find((subAccount) => subAccount.id === id)
          ?.sidebarOptions ?? []);

  const subAccounts =
    user.agency?.subAccounts?.filter((subAccount) =>
      user.permissions.find(
        (permission) =>
          permission.subAccountId === subAccount.id && permission.access,
      ),
    ) ?? [];

  return (
    <>
      <MenuOptions
        user={user}
        details={details}
        defaultOpen={false}
        id={user.agencyId}
        sidebarLogo={sidebarLogo}
        subAccounts={subAccounts}
        sidebarOptions={sidebarOptions}
      />
      <MenuOptions
        user={user}
        details={details}
        defaultOpen={true}
        id={user.agencyId}
        sidebarLogo={sidebarLogo}
        subAccounts={subAccounts}
        sidebarOptions={sidebarOptions}
      />
    </>
  );
}
