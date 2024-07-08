"use client";
import { use } from "react";
// UTILS
import { signOut } from "@/server/actions/auth";
// CONTEXT
import { SessionContext } from "@/providers/session-provider";

export function useAuth() {
  const { user, session } = use(SessionContext);

  if (session === null && user === null) {
    return {
      isSignedIn: false,
    };
  }

  const signOutAction = async () => {
    await signOut()
  }

  return {
    isSignedIn: true,
    userId: user.id,
    sessionId: session.id,
    role: user.role,
    signOut: signOutAction,
  };
}
