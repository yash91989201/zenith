import "server-only";
import { headers } from "next/headers";
import { userAgent } from "next/server";
import { Argon2id } from "oslo/password";
import { and, eq, getTableColumns } from "drizzle-orm";
// UTILS
import { db } from "@/server/db";
import { validateRequest } from "@/lib/auth";
// SCHEMAS
import {
  UserTable,
  AgencyTable,
  SubAccountTable,
  InvitationTable,
  NotificationTable,
  OAuthAccountTable,
} from "@/server/db/schema";
// TYPES
import type { Readable } from "stream";
import type { UserInsertType, UserType } from "@/lib/types";

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

export function getUserOAuthAccounts(userId: string) {
  return db.query.OAuthAccountTable.findMany({
    where: eq(OAuthAccountTable.userId, userId)
  })
}

export async function currentUser() {
  const { user, session } = await validateRequest();

  if (!session || !user) {
    throw new Error("UNAUTHORIZED")
  }

  return {
    user,
    session
  };
}

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

export async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
};

export async function saveActivityLog(
  {
    agencyId,
    activity,
    subAccountId
  }: {
    agencyId?: string;
    activity: string;
    subAccountId?: string
  }) {

  let userData: UserType | undefined;
  const { user } = await validateRequest()
  if (!user) {
    const userBySubAccountId = await db
      .select(getTableColumns(UserTable))
      .from(UserTable)
      .innerJoin(AgencyTable, eq(UserTable.agencyId, AgencyTable.id))
      .innerJoin(SubAccountTable, eq(AgencyTable.id, SubAccountTable.agencyId))
      .where(eq(SubAccountTable.id, subAccountId ?? ""))
    if (userBySubAccountId.length > 1) {
      userData = userBySubAccountId[0]
    }
  } else {
    userData = await db.query.UserTable.findFirst({ where: eq(UserTable.email, user.email) })
  }
  if (!userData) {
    throw new Error("Unable to find user")
  }

  let foundAgencyId: string = agencyId ?? "";
  if (!foundAgencyId) {
    if (!subAccountId) {
      throw new Error("You need to provide atleast an agency id or subaccount id.")
    }

    const subAccount = await db.query.SubAccountTable.findFirst({ where: eq(SubAccountTable.id, subAccountId) })
    if (subAccount) {
      foundAgencyId = subAccount.agencyId
    }
  }

  if (subAccountId) {
    await db.insert(NotificationTable).values({
      text: `${userData.name} | ${activity}`,
      userId: userData.id,
      agencyId: foundAgencyId,
      subAccountId: subAccountId,
    })
  } else {
    await db.insert(NotificationTable).values({
      text: `${userData.name} | ${activity}`,
      userId: userData.id,
      agencyId: foundAgencyId,
    })
  }
}

export async function createTeamUser(user: UserInsertType): Promise<{ status: "SUCCESS" | "FAILED"; message: string; }> {
  if (user?.role === "AGENCY_OWNER") {
    return {
      status: "FAILED",
      message: "Cannot create team user, user is agency owner."
    }
  }

  const [createTeamUserQuery] = await db.insert(UserTable).values(user)
  if (createTeamUserQuery.affectedRows === 0) {
    return {
      status: "FAILED",
      message: "Unable to create team user."
    }
  }
  return {
    status: "SUCCESS",
    message: "team user created successfully."
  }
}

export async function verifyAndAcceptInvitation(user: UserType) {

  const userInvitation = await db.query.InvitationTable.findFirst({
    where: and(
      eq(InvitationTable.email, user.email),
      eq(InvitationTable.status, "PENDING"),
    ),
  })

  if (userInvitation !== undefined) {
    const createTeamUserRes = await createTeamUser({
      email: userInvitation.email,
      agencyId: userInvitation.agencyId,
      avatarUrl: user.avatarUrl,
      id: user.id,
      name: user.name,
      role: userInvitation.role,
    })

    await saveActivityLog({
      agencyId: userInvitation?.agencyId ?? "",
      activity: "Joined",
    })

    if (createTeamUserRes.status === "SUCCESS") {

      await db.update(UserTable).set({ role: userInvitation.role }).where(eq(UserTable.id, user.id))
      await db.delete(InvitationTable).where(eq(InvitationTable.email, user.email))

      return userInvitation.agencyId
    } else {
      return null
    }
  } else {
    const agency = await db.query.UserTable.findFirst({ where: eq(UserTable.email, user.email) })
    return agency ? agency.agencyId : null
  }
}