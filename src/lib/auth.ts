import { cache } from "react";
import { Lucia } from "lucia";
import { cookies } from "next/headers";
import { GitHub, Google } from "arctic";
// UTILS
import { env } from "@/env";
import { luciaDbAdapter } from "@/server/db";
// TYPES
import type { Session, User } from "lucia";
import type { UserType } from "@/lib/types";

export const lucia = new Lucia(luciaDbAdapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
      name: attributes.name,
      avatarUrl: attributes.avatarUrl,
      email: attributes.email,
      role: attributes.role,
      emailVerified: attributes.emailVerified,
      twoFactorEnabled: attributes.twoFactorEnabled,
      agencyId: attributes.agencyId
    };
  },
  getSessionAttributes: (attributes) => {
    return {
      browser: attributes.browser,
      os: attributes.os,
      ip: attributes.ip,
    }
  }
});

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session?.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch { }
    return result;
  },
);

export const googleOAuth = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${env.NEXT_PUBLIC_URL}/api/oauth/google/callback`
)

export const githubOAuth = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET,
  {
    redirectURI: `${env.NEXT_PUBLIC_URL}/api/oauth/github/callback`
  }
)

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
  }
  interface DatabaseSessionAttributes {
    browser: string;
    os: string;
    ip: string;
  }
}

// eslint-disable-next-line
interface DatabaseUserAttributes extends UserType { }
