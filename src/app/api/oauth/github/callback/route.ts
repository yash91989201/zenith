import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { userAgent } from "next/server";
// SCHEMAS
import { OAuthAccountTable, UserTable } from "@/server/db/schema";
// UTILS
import { env } from "@/env";
import { db } from "@/server/db";
import { githubOAuth, lucia } from "@/lib/auth";
// TYPES
import type { NextRequest } from "next/server";
import type { CreateGithubOAuthUserResponseType, GithubUserEmailType, GithubUserType, UserInsertType } from "@/lib/types";

export async function GET(req: NextRequest) {

  const url = new URL(req.url)

  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const savedState = cookies().get("state")?.value

  if (!code || !state || !savedState) {
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
  const { accessToken } = await githubOAuth.validateAuthorizationCode(code)

  const githubRes = await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  const githubEmailRes = await fetch("https://api.github.com/user/emails", {
    method: "GET",
    headers: {
      Authorization: `token ${accessToken}`
    }
  })
  const githubUserData = (await githubRes.json()) as GithubUserType
  const githubUserEmailData = (await githubEmailRes.json()) as GithubUserEmailType

  const createGithubOAuthUserResponse = await db.transaction(async (trx): CreateGithubOAuthUserResponseType => {
    const user = await trx.query.UserTable.findFirst({
      where: eq(UserTable.email, githubUserEmailData[0]?.email ?? "")
    });

    if (!user) {
      const newUser: Omit<UserInsertType, "id"> & { id: string } = {
        id: githubUserData.id,
        name: githubUserData.name,
        avatarUrl: githubUserData.avatar_url,
        email: githubUserEmailData[0]?.email ?? "",
        emailVerified: (githubUserEmailData[0]?.verified === undefined || !githubUserEmailData[0]?.verified) ? null : new Date(),
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

      const [createGithubOAuthAccountRes] = await trx.insert(OAuthAccountTable).values({
        provider: "github",
        providerUserId: githubUserData.id,
        accessToken,
        userId: newUser.id
      });

      if (createGithubOAuthAccountRes.affectedRows === 0) {
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
      const userGithubOAuthEntry = await trx.query.OAuthAccountTable.findFirst({
        where: and(
          eq(OAuthAccountTable.userId, user.id),
          eq(OAuthAccountTable.provider, "github"),
        )
      });

      if (!userGithubOAuthEntry) {
        const [createUserGithubOAuthDataRes] = await trx.insert(OAuthAccountTable).values({
          provider: "github",
          providerUserId: githubUserData.id,
          accessToken,
          userId: user.id
        });

        if (createUserGithubOAuthDataRes.affectedRows === 0) {
          trx.rollback();
          return {
            status: "failed",
            error: "Unable to add github o auth try again",
            data: null
          };
        }
      }

      const [updateUserGithubOAuthDataRes] = await trx.update(OAuthAccountTable).set({
        accessToken,
      });

      if (updateUserGithubOAuthDataRes.affectedRows === 0) {
        trx.rollback();
        return {
          status: "failed",
          error: "Unable to update github o auth try again",
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

  const { status, data: user } = createGithubOAuthUserResponse
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
    { createGithubOAuthUserResponse },
    { status: 400 }
  )
}