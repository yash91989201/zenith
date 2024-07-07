"use client";
import { use } from "react";
// UTILS
import { signOut as signOutAction } from "@/server/actions/auth";
// CONTEXT
import { SessionContext } from "@/providers/session-provider";

export function useAuth() {
  const { user, session } = use(SessionContext);

  if (session === null && user === null) {
    return {
      isSignedIn: false,
    };
  }

  const signOut = async () => {
    await signOutAction()
  }

  return {
    isSignedIn: true,
    userId: user.id,
    sessionId: session.id,
    role: user.role,
    signOut,
  };
}
