"use client";
import { use } from "react";
// UTILS
import { api } from "@/trpc/react";
// CONTEXT
import { SessionContext } from "@providers/session-provider";

export function useSessionList() {
  const { user, session } = use(SessionContext);

  if (session === null && user === null) {
    throw new Error("Un authorized")
  }

  const { data: sessions = [], isLoading } = api.user.getSessionList.useQuery()
  const { mutateAsync: deleteSession, isPending: isDeletingSession } = api.user.deleteSession.useMutation()

  if (isLoading) {
    return {
      isLoading: true,
      isSignedIn: false,
    }
  }

  return {
    isSignedIn: true,
    sessions,
    deleteSession,
    isDeletingSession
  };
}
