import { eq } from "drizzle-orm";
// DB TABLES
import { FunnelTable } from "@/server/db/schema";
// SCHEMAS
import { GetAllFunnelSchema, UpsertFunnelSchema, } from "@/lib/schema";
// UTILS
import { procedureError } from "@/server/helpers";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// TYPES
import type { UpsertFunnelType } from "@/lib/types";

export const funnelRouter = createTRPCRouter({
  getAll: protectedProcedure.input(GetAllFunnelSchema).query(({ ctx, input }) => {
    return ctx.db.query.FunnelTable.findMany({
      where: eq(FunnelTable.subAccountId, input.subAccountId),
      with: {
        funnelPages: true
      }
    })
  }),

  upsertFunnel: protectedProcedure.input(UpsertFunnelSchema).mutation(async ({ ctx, input }): ProcedureStatus<UpsertFunnelType> => {
    try {
      const funnel = await ctx.db.query.FunnelTable.findFirst({ where: eq(FunnelTable.id, input?.id ?? "") })

      if (funnel) {
        const [updateFunnelQuery] = await ctx.db
          .update(FunnelTable)
          .set(input)
          .where(
            eq(FunnelTable.id, funnel.id)
          )

        if (updateFunnelQuery.affectedRows === 0) throw new Error("Unable to update funnel")

        return {
          status: "SUCCESS",
          message: "Funnel updated"
        }
      }

      const [createFunnelQuery] = await ctx.db
        .insert(FunnelTable)
        .values({
          ...input,
          subAccountId: input.subAccountId,
        })

      if (createFunnelQuery.affectedRows === 0) throw new Error("Unable to create funnel")

      return {
        status: "SUCCESS",
        message: "New funnel created"
      }
    } catch (error) {
      return procedureError(error)
    }
  })
});
