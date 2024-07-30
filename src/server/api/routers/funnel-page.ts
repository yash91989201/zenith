import { asc, count, eq } from "drizzle-orm";
// DB TABLES
import { FunnelPageTable } from "@/server/db/schema";
// SCHEMAS
import { DeleteFunnelPageSchema, GetAllFunnelPagesSchema, ReorderFunnelPageSchema, UpsertFunnelPageSchema } from "@/lib/schema";
// UTILS
import { procedureError } from "@/server/helpers";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// TYPES
import type { DeleteFunnelPageType, UpsertFunnelType } from "@/lib/types";

export const funnelPageRouter = createTRPCRouter({
  getAll: protectedProcedure.input(GetAllFunnelPagesSchema).query(({ ctx, input }) => {
    return ctx.db.query.FunnelPageTable.findMany({
      where: eq(FunnelPageTable.funnelId, input.funnelId),
      orderBy: [asc(FunnelPageTable.order)]
    })
  }),

  upsert: protectedProcedure.input(UpsertFunnelPageSchema).mutation(async ({ ctx, input }): ProcedureStatus<UpsertFunnelType> => {
    const { funnelId, funnelPage } = input

    try {
      const funnelPageExists = await ctx.db.query.FunnelPageTable.findFirst({
        where: eq(FunnelPageTable.id, funnelPage?.id ?? "")
      })

      if (funnelPageExists) {
        const [updateFunnelPageQuery] = await ctx.db
          .update(FunnelPageTable)
          .set(funnelPage)
          .where(
            eq(FunnelPageTable.id, funnelPageExists.id)
          )

        if (updateFunnelPageQuery.affectedRows === 0) throw new Error()

        return {
          status: "SUCCESS",
          message: "Funnel page updated"
        }
      }

      const funnelPages = await ctx.db.select({
        count: count()
      })
        .from(FunnelPageTable)
        .where(eq(FunnelPageTable.funnelId, funnelId))

      const [createFunnelPageQuery] = await ctx.db
        .insert(FunnelPageTable)
        .values({
          ...funnelPage,
          order: funnelPages[0]?.count,
          content: JSON.stringify([
            {
              content: [],
              id: '__body',
              name: 'Body',
              styles: { backgroundColor: 'white' },
              type: '__body',
            },
          ]),
          funnelId,
        })

      if (createFunnelPageQuery.affectedRows === 0) throw new Error()

      return {
        status: "SUCCESS",
        message: "Funnel page created"
      }
    } catch (error) {
      return procedureError(error)
    }
  }),

  reorder: protectedProcedure.input(ReorderFunnelPageSchema).mutation(async ({ ctx, input }) => {
    const { funnelPages } = input
    try {
      await Promise.all(funnelPages.map(async (funnelPage) => {
        await ctx.db.update(FunnelPageTable).set({ order: funnelPage.order }).where(eq(FunnelPageTable.id, funnelPage.id))
      }))

      return {
        status: "SUCCESS",
        message: "funnel page reorder successful"
      }
    } catch (error) {
      return procedureError(error)
    }
  }),

  delete: protectedProcedure.input(DeleteFunnelPageSchema).mutation(async ({ ctx, input }): ProcedureStatus<DeleteFunnelPageType> => {
    try {
      const [deleteFunnelPageQuery] = await ctx.db
        .delete(FunnelPageTable)
        .where(
          eq(FunnelPageTable.id, input.funnelPageId)
        )

      if (deleteFunnelPageQuery.affectedRows === 0) throw new Error("Unable to delete funnel page")

      return {
        status: "SUCCESS",
        message: "Funnel page deleted"
      }
    } catch (error) {

      return procedureError<DeleteFunnelPageType>(error)
    }
  })
});
