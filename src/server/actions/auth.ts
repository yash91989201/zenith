"use server"
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";
import { generateCodeVerifier, generateState } from "arctic";
// SCHEMAS
import { CredsSignInSchema, CredsSignUpSchema } from "@/lib/schema";
import { OAuthAccountTable, UserTable } from "@/server/db/schema";
// UTILS
import { env } from "@/env";
import { db } from "@/server/db";
import { verifyPassword } from "@/server/helpers"
import { parseZodValidationErrors } from "@/lib/utils";
import { githubOAuth, googleOAuth, lucia, validateRequest } from "@/lib/auth";
import { getUserByEmail, getUserDeviceInfo, getUserOAuthAccounts } from "@/server/helpers";
// TYPES
import type {
  CredsSignInType,
  CredsSignUpType,
  GithubAuthUrlResType,
  GoogleAuthUrlResType
} from "@/lib/types";

export async function createGoogleAuthUrl(): GoogleAuthUrlResType {

  try {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()

    cookies().set("code-verifier", codeVerifier, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
    })

    cookies().set("state", state, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
    })

    const authorizationUrl = await googleOAuth.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ["email", "profile"]
      }
    )

    return {
      status: "success",
      error: null,
      authorizationUrl: authorizationUrl.toString()
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: "failed",
        error: error.message,
        authorizationUrl: null,
      }
    }
    return {
      status: "failed",
      error: "Error occured!",
      authorizationUrl: null,
    }
  }
}

export async function createGithubAuthUrl(): GithubAuthUrlResType {

  try {
    const state = generateState()
    cookies().set("state", state, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
    })

    const authorizationUrl = await githubOAuth.createAuthorizationURL(
      state,
      {
        scopes: ["user:email"]
      }
    )

    return {
      status: "success",
      error: null,
      authorizationUrl: authorizationUrl.toString()
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: "failed",
        error: error.message,
        authorizationUrl: null,
      }
    }
    return {
      status: "failed",
      error: "Error occured!",
      authorizationUrl: null,
    }
  }

}

export async function credsSignUp(rawPayload: CredsSignUpType): CredsSignUpStatusType {
  try {
    const validatedPayload = CredsSignUpSchema.safeParse(rawPayload);
    if (!validatedPayload.success) {
      return {
        status: "FAILED",
        errors: parseZodValidationErrors(validatedPayload.error.flatten().fieldErrors),
        message: "Invalid credentials",
      };
    }

    const payload = validatedPayload.data

    const user = await db.query.UserTable.findFirst({
      where: eq(UserTable.email, payload.email)
    })

    if (user) {
      const oAuthEntry = await db.query.OAuthAccountTable.findFirst({
        where: eq(OAuthAccountTable.userId, user.id)
      })

      return {
        status: "FAILED",
        message: "Unable to Sign Up",
        errors: {
          email: oAuthEntry ? "OAuth account exists with this email" : "Email already in use"
        }
      }
    }

    const userId = createId()
    const avatarUrl = `https://api.dicebear.com/8.x/avataaars/svg?seed=${payload.name}&backgroundColor=c0aede,d1d4f9,ffd5dc,ffdfbf&accessories=prescription01,prescription02,round,sunglasses&clothing=blazerAndSweater,collarAndSweater,graphicShirt,hoodie,overall,shirtCrewNeck,shirtScoopNeck,shirtVNeck,blazerAndShirt&eyebrows=default,defaultNatural,flatNatural,raisedExcited,raisedExcitedNatural,unibrowNatural,upDown,upDownNatural&eyes=default,happy,surprised&facialHair[]&mouth=default,smile&top=bigHair,bun,curly,curvy,dreads,dreads01,dreads02,frida,frizzle,fro,froBand,hat,longButNotTooLong,miaWallace,shaggy,shaggyMullet,shavedSides,shortCurly,shortFlat,shortRound,shortWaved,sides,straight01,straight02,straightAndStrand,theCaesar,theCaesarAndSidePart,turban,winterHat02,winterHat03,winterHat04,winterHat1`

    const [createUserQuery] = await db.insert(UserTable).values({ id: userId, avatarUrl, ...payload })
    if (createUserQuery.affectedRows === 0) {
      return {
        status: "FAILED",
        message: "Unable to Sign Up try again"
      }
    }

    return {
      status: "SUCCESS",
      message: "Sign Up successful"
    }

  } catch (error) {
    return {
      status: "FAILED",
      message: "Unable to Sign Up try again"
    }
  }
}

export async function credsSignIn(rawPayload: CredsSignInType): CredsSignInStatusType {
  try {
    const validatedPayload = CredsSignInSchema.safeParse(rawPayload);
    if (!validatedPayload.success) {
      return {
        status: "FAILED",
        errors: parseZodValidationErrors(validatedPayload.error.flatten().fieldErrors),
        message: "Invalid credentials",
      };
    }

    const payload = validatedPayload.data
    const user = await getUserByEmail(payload.email)

    if (!user) {
      return {
        status: "FAILED",
        message: "Unable to Sign Up",
        errors: {
          email: "No use with this email"
        }
      }
    }

    // Check if user has only outh account registered
    const oAuthAccounts = await getUserOAuthAccounts(user.id)

    if (oAuthAccounts.length > 0 && user.password === null) {
      return {
        status: "FAILED",
        message: "Unable to Sign Up",
        errors: {
          email: "OAuth account registered with this email"
        }
      }
    }

    // verify password
    const isPasswordCorrect = await verifyPassword(
      user.password ?? "",
      payload.password,
    );

    if (!isPasswordCorrect) {
      return {
        status: "FAILED",
        message: "Unable to Sign Up try again"
      }
    }

    const session = await lucia.createSession(user.id, getUserDeviceInfo());
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return {
      status: "SUCCESS",
      message: "Sign In successful"
    }

  } catch (error) {
    return {
      status: "FAILED",
      message: "Unable to Sign In try again"
    }
  }
}

export async function signOut() {
  const { user, session } = await validateRequest();

  if (!session || !user) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect(`${env.NEXT_PUBLIC_URL}`);
}