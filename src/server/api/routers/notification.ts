import { eq } from "drizzle-orm";
// DB SCHEMAS
import { NotificationTable, SubAccountTable } from "@/server/db/schema";
// SCHEMAS
import { SaveActivityLogSchema } from "@/lib/schema";
// UTILS
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// TYPES
import type { SaveAvtivityLogType } from "@/lib/types";

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


});
