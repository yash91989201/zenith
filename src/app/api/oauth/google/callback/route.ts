import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { userAgent } from "next/server";
import { NextResponse } from "next/server";
// SCHEMAS
import { OAuthAccountTable, UserTable } from "@/server/db/schema";
// UTILS
import { env } from "@/env";
import { db } from "@/server/db";
import { lucia } from "@/lib/auth";
import { googleOAuth } from "@/lib/auth";
// TYPES
import type { NextRequest } from "next/server";
import type {
  GoogleUserType,
  UserInsertType,
  CreateGoogleOAuthUserResponseType,
} from "@/lib/types";

export async function GET(req: NextRequest) {

  const url = new URL(req.url)

  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const savedState = cookies().get("state")?.value
  const codeVerifier = cookies().get("code-verifier")?.value

  if (!code || !state || !codeVerifier || !savedState) {
    return Response.json(
      { error: "Invalid Request" },
      { status: 400 }
    )
  }

  if (savedState !== state) {
    return Response.json(
      { error: "Invalid Request" },
      { status: 400 }
    )
  }

  const userAgentData = userAgent(req)
  const { accessToken, accessTokenExpiresAt, refreshToken } = await googleOAuth.validateAuthorizationCode(code, codeVerifier)

  const googleRes = await fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  const googleUserData = (await googleRes.json()) as GoogleUserType

  const createGoogleOAuthUserResponse = await db.transaction(async (trx): CreateGoogleOAuthUserResponseType => {
    const user = await trx.query.UserTable.findFirst({
      where: eq(UserTable.email, googleUserData.email)
    });

    if (!user) {
      const newUser: Omit<UserInsertType, "id"> & { id: string } = {
        id: googleUserData.id,
        name: googleUserData.name,
        avatarUrl: googleUserData.picture,
        email: googleUserData.email,
        emailVerified: googleUserData.verified_email ? new Date() : null,
      };
      const [createUserRes] = await trx.insert(UserTable).values(newUser);

      if (createUserRes.affectedRows === 0) {
        trx.rollback();
        return {
          status: "failed",
          error: "Unable to login",
          data: null
        };
      }

      const [createGoogleOAuthAccountRes] = await trx.insert(OAuthAccountTable).values({
        username: googleUserData.email,
        provider: "google",
        providerUserId: googleUserData.id,
        accessToken,
        expiresAt: accessTokenExpiresAt,
        userId: newUser.id
      });

      if (createGoogleOAuthAccountRes.affectedRows === 0) {
        trx.rollback();
        return {
          status: "failed",
          error: "Unable to login",
          data: null
        };
      }

      return {
        status: "success",
        error: null,
        data: newUser
      };
    } else {
      const userGoogleOAuthEntry = await trx.query.OAuthAccountTable.findFirst({
        where: and(
          eq(OAuthAccountTable.userId, user.id),
          eq(OAuthAccountTable.provider, "google"),
        )
      });

      if (!userGoogleOAuthEntry) {
        const [createUserGoogleOAuthDataRes] = await trx.insert(OAuthAccountTable).values({
          username: googleUserData.email,
          provider: "google",
          providerUserId: googleUserData.id,
          accessToken,
          expiresAt: accessTokenExpiresAt,
          userId: user.id
        });

        if (createUserGoogleOAuthDataRes.affectedRows === 0) {
          trx.rollback();
          return {
            status: "failed",
            error: "Unable to add google o auth try again",
            data: null
          };
        }
      }

      const [updateUserGoogleOAuthDataRes] = await trx.update(OAuthAccountTable).set({
        accessToken,
        expiresAt: accessTokenExpiresAt,
        refreshToken,
      });

      if (updateUserGoogleOAuthDataRes.affectedRows === 0) {
        trx.rollback();
        return {
          status: "failed",
          error: "Unable to update google o auth try again",
          data: null
        };
      }
      return {
        status: "success",
        error: null,
        data: user
      }
    }
  });

  const { status, data: user } = createGoogleOAuthUserResponse
  if (status === "success") {
    const session = await lucia.createSession(user.id, {
      browser: `${userAgentData.browser.name ?? "unknown"} ${userAgentData.browser.version}`.trim(),
      os: `${userAgentData.os.name ?? "unknown"} ${userAgentData.os.version}`.trim(),
      ip: req.ip ?? ""
    })

    const sessionCookie = lucia.createSessionCookie(session.id)

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    )

    return NextResponse.redirect(
      new URL("/", env.NEXT_PUBLIC_URL),
      { status: 302 }
    )
  }

  return Response.json(
    { createGoogleOAuthUserResponse },
    { status: 400 }
  )
}