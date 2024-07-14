import { redirect } from "next/navigation";
// UTILS
import { api } from "@/trpc/server";
import { validateRequest } from "@/lib/auth";
import { verifyAndAcceptInvitation } from "@/server/helpers";
// TYPES
import type React from "react";
// UI
// CUSTOM COMPONENTS
import { InfoBar } from "@global/info-bar";
import { Sidebar } from "@/components/sidebar";
import { Unauthorized } from "@global/unauthorized";
import { AccountModal } from "@global/account-modal";
import BlurPage from "@/components/global/blur-page";
import { AccountModalProvider } from "@/providers/account-modal-provider";

type Props = {
  children: React.ReactNode;
  params: {
    subaccountId: string;
  };
};

export default async function SubAccountLayout({ params, children }: Props) {
  const { user } = await validateRequest();
  if (!user) return <Unauthorized />;

  const agencyId = await verifyAndAcceptInvitation(user);

  if (!agencyId) return <Unauthorized />;

  const userDetails = await api.user.getDetails({});

  const hasSubAccountPermission = userDetails?.permissions.find(
    (permission) =>
      permission.access && permission.subAccountId === params.subaccountId,
  );

  if (!hasSubAccountPermission) {
    return redirect("/subaccount/unauthorized");
  }

  void api.user.getNotifications.prefetch({
    agencyId,
    subAccountId: ["AGENCY_OWNER", "AGENCY_ADMIN"].includes(user?.role ?? "")
      ? params.subaccountId
      : undefined,
  });

  return (
    <>
      <Sidebar id={params.subaccountId} type="subaccount" />
      <main className="md:pl-80">
        <AccountModalProvider>
          <InfoBar subAccountId={params.subaccountId} />
          <AccountModal />
        </AccountModalProvider>
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </main>
    </>
  );
}
