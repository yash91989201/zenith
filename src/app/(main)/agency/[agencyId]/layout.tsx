import { redirect } from "next/navigation";
// UTILS
import { api } from "@/trpc/server";
import { validateRequest } from "@/lib/auth";
// TYPES
import type { ReactNode } from "react";
// CUSTOM COMPONENTS
import InfoBar from "@global/Infobar";
import BlurPage from "@global/blur-page";
import { Sidebar } from "@/components/sidebar";
import { AccountModal } from "@global/account-modal";
import { AccountModalProvider } from "@providers/account-modal-provider";

export default async function AgencyLayout({
  params,
  children,
}: {
  children: ReactNode;
  params: { agencyId: string };
}) {
  const { agencyId } = params;

  const { user } = await validateRequest();
  if (!user) return redirect("/");

  if (!agencyId) return redirect("/agency");

  if (user?.role !== "AGENCY_OWNER" && user?.role !== "AGENCY_ADMIN") {
    return redirect("/agency/unauthorized");
  }

  const notifications = await api.user.getNotifications({
    agencyId,
  });

  return (
    <>
      <Sidebar id={agencyId} type="agency" />
      <main className="md:pl-80">
        <AccountModalProvider>
          <InfoBar notifications={notifications} />
          <AccountModal />
        </AccountModalProvider>
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </main>
    </>
  );
}
