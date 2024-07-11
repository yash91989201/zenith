"use client";
import { use } from "react";
// CONTEXT
import { SessionContext } from "@providers/session-provider";

export function useSession() {
  const { user, session } = use(SessionContext);

  if (session === null && user === null) {
    return {
      isSignedIn: false,
    };
  }

  return {
    isSignedIn: true,
    session,
  };
}
