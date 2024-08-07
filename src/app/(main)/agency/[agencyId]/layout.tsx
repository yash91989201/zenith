import { redirect } from "next/navigation";
// UTILS
import { api } from "@/trpc/server";
import { validateRequest } from "@/lib/auth";
// TYPES
import type { ReactNode } from "react";
// CUSTOM COMPONENTS
import BlurPage from "@global/blur-page";
import { Sidebar } from "@/components/sidebar";
import { AccountModal } from "@global/account-modal";
import { InfoBar } from "@/components/global/info-bar";
import { LiveNotification } from "@global/live-notification";
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

  void api.user.getNotifications.prefetch({ agencyId });

  return (
    <>
      <Sidebar id={agencyId} type="agency" />
      <main className="md:pl-80">
        <AccountModalProvider>
          <InfoBar />
          <AccountModal />
        </AccountModalProvider>
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </main>
      <LiveNotification />
    </>
  );
}
