import "server-only"

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { userAgent } from "next/server";
import { Argon2id } from "oslo/password"
// SCHEMAS
import { UserTable } from "@/server/db/schema";
// UTILS
import { db } from "@/server/db";
import { validateRequest } from "@/lib/auth";

const argon2id = new Argon2id();

export function hashPassword(password: string) {
  return argon2id.hash(password);
}

export function verifyPassword(hashedPassword: string, password: string) {
  return argon2id.verify(hashedPassword, password);
}

export function getUserByEmail(email: string) {
  return db.query.UserTable.findFirst({
    where: eq(UserTable.email, email),
  });
}

export async function getUser() {
  const { user, session } = await validateRequest();

  if (!session || !user) {
    throw new Error("UNAUTHORIZED")
  }

  return {
    user,
    session
  };
}

// only use in server actions
export function getUserDeviceInfo() {
  let ip;
  const FALLBACK_IP_ADDRESS = "0.0.0.0"

  const headerData = headers()
  const userAgentData = userAgent({ headers: headerData })

  const forwardedFor = headerData.get('x-forwarded-for')

  if (forwardedFor) {
    ip = forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS
  } else {
    ip = headerData.get('x-real-ip') ?? FALLBACK_IP_ADDRESS
  }

  return {
    browser: `${userAgentData.browser.name ?? "unknown"} ${userAgentData.browser.version}`.trim(),
    os: `${userAgentData.os.name ?? "unknown"} ${userAgentData.os.version}`.trim(),
    ip
  }
}