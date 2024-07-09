"use client";
import { use } from "react";
// UTILS
import { api } from "@/trpc/react";
// CONTEXT
import { SessionContext } from "@/providers/session-provider";

export function useOAuthAccounts() {
  const { user, session } = use(SessionContext);

  if (session === null && user === null) {
    throw new Error("Un authorized")
  }

  const { data: oAuthAccounts = [], isLoading } = api.user.getOAuthAccounts.useQuery()
  const { mutateAsync: deleteOAuthAccount, isPending: isDeletingSession } = api.user.deleteOAuthAccount.useMutation()

  if (isLoading) {
    return {
      isLoading: true,
      isSignedIn: false,
    }
  }

  return {
    isSignedIn: true,
    oAuthAccounts,
    deleteOAuthAccount,
    isDeletingSession
  };
}
