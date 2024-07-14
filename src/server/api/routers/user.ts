import { and, asc, eq, getTableColumns, sql } from "drizzle-orm";
// DB SCHEMAS
import {
  UserTable,
  SessionTable,
  OAuthAccountTable,
  NotificationTable,
  SubAccountSidebarOptionTable,
  AgencySidebarOptionTable,
} from "@/server/db/schema";
// SCHEMAS
import {
  UpdateAvatarSchema,
  DeleteSessionSchema,
  UpdateUsernameSchema,
  DeleteOAuthAccountSchema,
  GetUserNotificationsSchema,
  UpdateUserByIdSchema,
  DeleteUserSchema,
  GetUserDetailsSchema,
  GetAgencyAndPermissionsSchema,
} from "@/lib/schema";
// UTILS
import { env } from "@/env";
import {
  createTRPCRouter,
  protectedProcedure
} from "@/server/api/trpc";
// TYPES
import type {
  UpdateAvatarType,
  DeleteSessionType,
  UpdateUsernameType,
  DeleteOAuthAccountType,
  UpdateUserByIdType,
  DeleteUserType,
} from "@/lib/types";
import { procedureError } from "@/server/helpers";

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

  getDetails: protectedProcedure.input(GetUserDetailsSchema).query(({ ctx, input }) => {
    return ctx.db.query.UserTable.findFirst({
      where: eq(UserTable.id, input.id ?? ctx.session.user.id),
      columns: {
        password: false
      },
      with: {
        agency: {
          with: {
            sidebarOptions: {
              orderBy: [asc(AgencySidebarOptionTable.order)],
            },
            subAccounts: {
              with: {
                sidebarOptions: {
                  orderBy: [asc(SubAccountSidebarOptionTable.order)],
                }
              }
            }
          }
        },
        permissions: true
      }
    })
  }),

  getAgencyAndPermissions: protectedProcedure.input(GetAgencyAndPermissionsSchema).query(({ ctx, input }) => {
    return ctx.db.query.UserTable.findMany({
      with: {
        agency: {
          with: {
            subAccounts: true,
          },
        },
        permissions: {
          with: {
            subAccount: true,
          },
        },
      },
    }).then((res) => res.filter((res) => res.agency?.id === input.agencyId));
  }),

  getNotifications: protectedProcedure.input(GetUserNotificationsSchema).query(async ({ ctx, input }) => {
    const notificationDynamicQuery = ctx.db
      .select({
        ...getTableColumns(NotificationTable),
        user: {
          ...getTableColumns(UserTable),
        }
      })
      .from(NotificationTable)
      .innerJoin(
        UserTable,
        eq(NotificationTable.agencyId, UserTable.agencyId)
      )
      .where(
        eq(NotificationTable.agencyId, input.agencyId)
      ).$dynamic()

    if (input.subAccountId && !["AGENCY_OWNER", "AGENCY_ADMIN"].includes(ctx.session.user.role)) {
      await notificationDynamicQuery.where(
        and(
          eq(NotificationTable.agencyId, input.agencyId),
          eq(NotificationTable.subAccountId, input.subAccountId),
        )
      )
    }

    const notifications = await notificationDynamicQuery
    return notifications
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

  updateById: protectedProcedure.input(UpdateUserByIdSchema).mutation(async ({ ctx, input }): ProcedureStatus<UpdateUserByIdType> => {
    try {
      const userExists = await ctx.db.query.UserTable.findFirst({ where: eq(UserTable.id, input.id) })

      if (!userExists) throw new Error("No user exists with this id")

      const [updateUserQuery] = await ctx.db.update(UserTable).set(input).where(eq(UserTable.id, input.id))

      if (updateUserQuery.affectedRows === 0) throw new Error("Unable to update user")

      return {
        status: "SUCCESS",
        message: "User data updated"
      }
    } catch (error) {
      return procedureError(error)
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
  }),

  delete: protectedProcedure.input(DeleteUserSchema).mutation(async ({ ctx, input }): ProcedureStatus<DeleteUserType> => {
    try {
      const [deleteUserQuery] = await ctx.db.delete(UserTable).where(eq(UserTable.id, input.userId))

      if (deleteUserQuery.affectedRows === 0) throw new Error()

      return {
        status: "SUCCESS",
        message: "Unable to delete user"
      }
    } catch (error) {
      return procedureError(error)
    }
  })
});
