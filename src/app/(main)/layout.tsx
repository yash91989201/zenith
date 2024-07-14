import type React from "react";
// UTILS
import { validateRequest } from "@/lib/auth";
// CUSTOM COMPONENTS
import { HydrateClient } from "@/trpc/server";
import { SessionProvider } from "@providers/session-provider";

export default async function MainLayout({
  children,
}: {
  children: React.ReactElement;
}) {
  const user = await validateRequest();

  return (
    <SessionProvider user={user}>
      <HydrateClient>{children}</HydrateClient>
    </SessionProvider>
  );
}
