import { asc, eq } from "drizzle-orm";
// DB TABLES
import { FunnelPageTable, FunnelTable } from "@/server/db/schema";
// SCHEMAS
import { GetAllFunnelSchema, GetFunnelSchema, UpdateFunnelProductsSchema, UpsertFunnelSchema, } from "@/lib/schema";
// UTILS
import { procedureError } from "@/server/helpers";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// TYPES
import type { UpdateFunnelProductsType, UpsertFunnelType } from "@/lib/types";

export const funnelRouter = createTRPCRouter({
  getById: protectedProcedure.input(GetFunnelSchema).query(({ ctx, input }) => {
    return ctx.db.query.FunnelTable.findFirst({
      where: eq(FunnelTable.id, input.funnelId),
      with: {
        funnelPages: {
          orderBy: [asc(FunnelPageTable.order)]
        },
      }
    })
  }),

  getAll: protectedProcedure.input(GetAllFunnelSchema).query(({ ctx, input }) => {
    return ctx.db.query.FunnelTable.findMany({
      where: eq(FunnelTable.subAccountId, input.subAccountId),
      with: {
        funnelPages: true
      }
    })
  }),

  updateProducts: protectedProcedure.input(UpdateFunnelProductsSchema).mutation(async ({ ctx, input }): ProcedureStatus<UpdateFunnelProductsType> => {
    try {
      const [updateFunnelQuery] = await ctx.db.update(FunnelTable).set({
        liveProducts: input.liveProducts
      })
        .where(eq(FunnelTable.id, input.funnelId))

      if (updateFunnelQuery.affectedRows === 0) throw new Error("")

      return {
        status: "SUCCESS",
        message: "Funnel products updated"
      }

    } catch (error) {
      return procedureError<UpdateFunnelProductsType>(error)
    }
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
