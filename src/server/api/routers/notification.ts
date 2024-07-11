import { eq, inArray } from "drizzle-orm";
// DB SCHEMAS
import { NotificationTable, SubAccountTable } from "@/server/db/schema";
// SCHEMAS
import { MarkNotificationsReadSchema, SaveActivityLogSchema } from "@/lib/schema";
// UTILS
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// TYPES
import type { MarkNotificationsReadType, SaveAvtivityLogType } from "@/lib/types";
import { procedureError } from "@/server/helpers";

export const notificationRouter = createTRPCRouter({
  saveActivityLog: protectedProcedure.input(SaveActivityLogSchema).mutation(async ({ ctx, input }): ProcedureStatus<SaveAvtivityLogType> => {
    const { agencyId, activity, subAccountId } = input
    const userData = ctx.session.user;
    let foundAgencyId: string = agencyId ?? "";

    try {
      if (!foundAgencyId) {
        if (!subAccountId) {
          throw new Error("You need to provide atleast an agency id or subaccount id.")
        }

        const subAccount = await ctx.db.query.SubAccountTable.findFirst({ where: eq(SubAccountTable.id, subAccountId) })
        if (subAccount) {
          foundAgencyId = subAccount.agencyId
        }
      }

      if (subAccountId) {
        await ctx.db.insert(NotificationTable).values({
          text: `${userData.name} | ${activity}`,
          userId: userData.id,
          agencyId: foundAgencyId,
          subAccountId: subAccountId,
        })
      } else {
        await ctx.db.insert(NotificationTable).values({
          text: `${userData.name} | ${activity}`,
          userId: userData.id,
          agencyId: foundAgencyId,
        })
      }

      return {
        status: "SUCCESS",
        message: "Activity log saved"
      }
    } catch (error) {
      return {
        status: "FAILED",
        message: "Unable to save activity log"
      }
    }
  }),

  markAllAsRead: protectedProcedure.input(MarkNotificationsReadSchema).mutation(async ({ ctx, input }): ProcedureStatus<MarkNotificationsReadType> => {
    try {
      if (input.notificationIds.length === 0) throw new Error("Provide atleast one notification id")
      const [markNotificationReadQuery] = await ctx.db
        .update(NotificationTable)
        .set({
          read: true,
        })
        .where(
          inArray(NotificationTable.id, input.notificationIds)
        )

      if (markNotificationReadQuery.affectedRows === 0) throw new Error("Unable to mark notifications as read")

      return {
        status: "SUCCESS",
        message: "Notifications marked as read"
      }

    } catch (error) {
      return procedureError(error)
    }
  })
});
