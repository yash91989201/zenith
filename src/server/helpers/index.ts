import "server-only";
import { headers } from "next/headers";
import { userAgent } from "next/server";
import { Argon2id } from "oslo/password";
import { createId } from "@paralleldrive/cuid2";
import { and, eq, getTableColumns } from "drizzle-orm";
// UTILS
import { env } from "@/env";
import { db } from "@/server/db";
import { validateRequest } from "@/lib/auth";
import { ProcedureError } from "@/lib/utils";
import { saveFileInBucket } from "@/server/helpers/store";
// SCHEMAS
import {
  UserTable,
  AgencyTable,
  SubAccountTable,
  InvitationTable,
  OAuthAccountTable,
  NotificationTable,
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

export function getImageExtension(contentType: string) {
  let fileExtension = '';
  if (contentType) {
    if (contentType.includes('image/jpeg')) {
      fileExtension = 'jpg';
    } else if (contentType.includes('image/png')) {
      fileExtension = 'png';
    } else if (contentType.includes('image/gif')) {
      fileExtension = 'gif';
    } else if (contentType.includes('image/webp')) {
      fileExtension = 'webp';
    } else {
      return null
    }
  } else {
    return null
  }
  return fileExtension
}

export async function saveOAuthAccountImage(profileUrl: string, userName: string) {

  // fetch image from google
  const profileRes = await fetch(profileUrl)
  const profileImage = await profileRes.blob();
  const profileImageArrayBuffer = await profileImage.arrayBuffer()

  const fileExtension = getImageExtension(profileImage.type)

  if (fileExtension === null) {
    const profileImageExt = "png"
    // get random profile from dicebear
    const profileRes = await fetch(`https://api.dicebear.com/8.x/avataaars/${profileImageExt}?seed=${userName}&backgroundColor=c0aede,d1d4f9,ffd5dc,ffdfbf&accessories=prescription01,prescription02,round,sunglasses&clothing=blazerAndSweater,collarAndSweater,graphicShirt,hoodie,overall,shirtCrewNeck,shirtScoopNeck,shirtVNeck,blazerAndShirt&eyebrows=default,defaultNatural,flatNatural,raisedExcited,raisedExcitedNatural,unibrowNatural,upDown,upDownNatural&eyes=default,happy,surprised&facialHair[]&mouth=default,smile&top=bigHair,bun,curly,curvy,dreads,dreads01,dreads02,frida,frizzle,fro,froBand,hat,longButNotTooLong,miaWallace,shaggy,shaggyMullet,shavedSides,shortCurly,shortFlat,shortRound,shortWaved,sides,straight01,straight02,straightAndStrand,theCaesar,theCaesarAndSidePart,turban,winterHat02,winterHat03,winterHat04,winterHat1`)
    const profileImage = await profileRes.blob();
    const profileImageArrayBuffer = await profileImage.arrayBuffer()

    const fileName = `${createId()}.${profileImageExt}`
    const fileUrl = `${env.NEXT_PUBLIC_URL}/api/file/profile?file=${fileName}`
    await saveFileInBucket(
      {
        bucketName: "profile",
        fileName,
        file: Buffer.from(profileImageArrayBuffer)
      }
    )
    return fileUrl
  }

  const fileName = `${createId()}.${fileExtension}`
  const fileUrl = `${env.NEXT_PUBLIC_URL}/api/file/profile?file=${fileName}`
  await saveFileInBucket(
    {
      bucketName: "profile",
      fileName,
      file: Buffer.from(profileImageArrayBuffer)
    }
  )

  return fileUrl
}

export async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
};

export function procedureError<ProcedureType>(error: unknown): ProcedureFailType<ProcedureType> {
  if (error instanceof ProcedureError) {
    return {
      status: "FAILED",
      message: error.message,
      errors: error.error as ProcedureType,
    };
  } else if (error instanceof Error) {
    return {
      status: "FAILED",
      message: error.message,
    };
  } else {
    return {
      status: "FAILED",
      message: "Error occurred on procedure.",
    };
  }
}

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

  const [createTeamUserQuery] = await db.update(UserTable).set(user).where(eq(UserTable.email, user.email))
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
      activity: "New user joined",
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