import { and, eq, sql } from "drizzle-orm";
// SCHEMAS
import { DeleteOAuthAccountSchema, DeleteSessionSchema, UpdateAvatarSchema, UpdateUsernameSchema } from "@/lib/schema";
// UTILS
import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// DB SCHEMAS
import { OAuthAccountTable, SessionTable, UserTable } from "@/server/db/schema";
// TYPES
import type { DeleteOAuthAccountType, DeleteSessionType, UpdateAvatarType, UpdateUsernameType } from "@/lib/types";

export const userRouter = createTRPCRouter({
  getSessionList: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.SessionTable.findMany({
      where: eq(SessionTable.userId, ctx.session.user.id),
      extras: {
        current: sql<boolean>`${SessionTable.id} = ${ctx.session.session.id}`.as("current")
      }
    })
  }),

  getOAuthAccounts: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.OAuthAccountTable.findMany({ where: eq(OAuthAccountTable.userId, ctx.session.user.id) })
  }),

  getDetails: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.UserTable.findFirst({
      where: eq(UserTable.id, ctx.session.user.id),
      columns: {
        password: false
      },
      with: {
        agency: {
          with: {
            sidebarOptions: true,
            subAccounts: {
              with: {
                sidebarOptions: true
              }
            }
          }
        },
        permissions: true
      }
    })
  }),

  updateName: protectedProcedure.input(UpdateUsernameSchema).mutation(async ({ ctx, input }): ProcedureStatus<UpdateUsernameType> => {
    const [updateNameQuery] = await ctx.db.update(UserTable).set({
      name: input.name
    }).where(eq(UserTable.id, ctx.session.user.id))

    if (updateNameQuery.affectedRows === 0) {
      return {
        status: "FAILED",
        message: "Unable to update username"
      }
    }
    return {
      status: "SUCCESS",
      message: "Username updated successfully"
    }
  }),

  updateAvatar: protectedProcedure.input(UpdateAvatarSchema).mutation(async ({ ctx, input }): ProcedureStatus<UpdateAvatarType> => {
    const [updateAvatarQuery] = await ctx.db.update(UserTable).set({
      avatarUrl: input.avatarUrl
    }).where(eq(UserTable.id, ctx.session.user.id))

    if (updateAvatarQuery.affectedRows === 0) {
      return {
        status: "FAILED",
        message: "Unable to update avatar url",
      }
    }
    return {
      status: "SUCCESS",
      message: "Avatar url updated for user"
    }
  }),

  deleteOAuthAccount: protectedProcedure.input(DeleteOAuthAccountSchema).mutation(async ({ ctx, input }): ProcedureStatus<DeleteOAuthAccountType> => {

    try {
      const oAuthAccount = await ctx.db.query.OAuthAccountTable.findFirst({
        where: and(
          eq(OAuthAccountTable.userId, ctx.session.user.id),
          eq(OAuthAccountTable.provider, input.provider)
        )
      })

      if (!oAuthAccount) {
        return {
          status: "FAILED",
          message: "OAuth account not found"
        }
      }
      const { provider, accessToken } = oAuthAccount

      switch (provider) {
        case "google": {
          await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${accessToken}`);
          break;
        }
        case "github": {
          await fetch(`https://api.github.com/applications/${env.GITHUB_CLIENT_ID}/grant`, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/vnd.github+json',
              'Authorization': 'Basic ' + btoa(`${env.GITHUB_CLIENT_ID}:${env.GITHUB_CLIENT_SECRET}`),
              'X-GitHub-Api-Version': '2022-11-28',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              access_token: accessToken
            })
          })
          break;
        }
      }

      const [deleteOAuthAccountQuery] = await ctx.db
        .delete(OAuthAccountTable)
        .where(
          eq(OAuthAccountTable.id, oAuthAccount.id)
        )

      if (deleteOAuthAccountQuery.affectedRows === 0) {
        return {
          status: "FAILED",
          message: "Unable to delete oauth account"
        }
      }
      return {
        status: "SUCCESS",
        message: "OAuth account deleted successfully"
      }

    } catch (error) {
      return {
        status: "FAILED",
        message: "Unable to delete oauth account"
      }
    }
  }),

  deleteSession: protectedProcedure.input(DeleteSessionSchema).mutation(async ({ ctx, input }): ProcedureStatus<DeleteSessionType> => {
    const [deleteSessionQuery] = await ctx.db
      .delete(SessionTable)
      .where(
        and(
          eq(SessionTable.userId, ctx.session.user.id),
          eq(SessionTable.id, input.sessionId)
        )
      );

    if (deleteSessionQuery.affectedRows === 0) {
      return {
        status: "FAILED",
        message: "Unable to delete session"
      }
    }
    return {
      status: "SUCCESS",
      message: "Session deleted successfully"
    }
  })
});
