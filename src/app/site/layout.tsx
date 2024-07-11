// UTILS
import { validateRequest } from "@/lib/auth";
import { api, HydrateClient } from "@/trpc/server";
// TYPES
import type React from "react";
// PROVIDERS
import { SessionProvider } from "@providers/session-provider";
import { AccountModalProvider } from "@providers/account-modal-provider";
// CUSTOM COMPONENTS
import { Navigation } from "@/components/site/navigation";
import { AccountModal } from "@global/account-modal";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  const user = await validateRequest();

  void api.user.getSessionList.prefetch();
  void api.user.getOAuthAccounts.prefetch();

  return (
    <SessionProvider user={user}>
      <HydrateClient>
        <AccountModalProvider>
          <main className="h-full">
            <Navigation />
            {children}
          </main>
          <AccountModal />
        </AccountModalProvider>
      </HydrateClient>
    </SessionProvider>
  );
}
