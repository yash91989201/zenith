// UTILS
import { validateRequest } from "@/lib/auth";
// TYPES
import type React from "react";
// CUSTOM COMPONENTS
import { Navigation } from "@/components/site/navigation";
import { SessionProvider } from "@/providers/session-provider";
import { AccountModalProvider } from "@/providers/account-modal-provider";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  const user = await validateRequest();

  return (
    <SessionProvider user={user}>
      <AccountModalProvider>
        <main className="h-full">
          <Navigation />
          {children}
        </main>
      </AccountModalProvider>
    </SessionProvider>
  );
}
