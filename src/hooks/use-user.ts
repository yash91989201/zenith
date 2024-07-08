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

  const nameInitials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase()).join("")

  return {
    isSignedIn: true,
    user,
    nameInitials
  };
}
