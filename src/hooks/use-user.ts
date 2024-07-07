"use client";
import { use } from "react";
// CONTEXT
import { SessionContext } from "@/providers/session-provider";

export function useUser() {
  const { user, session } = use(SessionContext);

  if (session === null && user === null) {
    return {
      isSignedIn: false,
    };
  }

  const nameInitials = user?.name
    .split(" ")
    .filter((nameChunk) => nameChunk.charAt(0))
    .slice(0, 2)
    .join("");

  return {
    isSignedIn: true,
    user,
    nameInitials
  };
}
