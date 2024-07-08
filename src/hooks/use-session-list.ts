"use client";
import { use } from "react";
// UTILS
import { api } from "@/trpc/react";
// CONTEXT
import { SessionContext } from "@/providers/session-provider";

export function useSessionList() {
  const { user, session } = use(SessionContext);

  if (session === null && user === null) {
    return {
      isLoading: false,
      isSignedIn: false,
    };
  }

  const { data: sessions = [], isLoading } = api.user.getSessionList.useQuery()

  if (isLoading) {
    return {
      isLoading: true,
      isSignedIn: false,
    }
  }

  return {
    isSignedIn: true,
    sessions,
  };
}
