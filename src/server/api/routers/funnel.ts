import { eq } from "drizzle-orm";
// DB SCHEMAS
import { FunnelTable } from "@/server/db/schema";
// SCHEMAS
import { CreateFunnelProcedureSchema } from "@/lib/schema";
// UTILS
import type { CreateFunnelProcedureType } from "@/lib/types";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { procedureError } from "@/server/helpers";

export const funnelRouter = createTRPCRouter({
  upsertFunnel: protectedProcedure.input(CreateFunnelProcedureSchema).mutation(async ({ ctx, input }): ProcedureStatus<CreateFunnelProcedureType> => {
    try {
      const funnel = await ctx.db.query.FunnelTable.findFirst({ where: eq(FunnelTable.id, input.funnelId) })
      if (!funnel) {
        const [createFunnelQuery] = await ctx.db.insert(FunnelTable).values({
          ...input.funnel,
          subAccountId: input.subAccountId,
        })

        if (createFunnelQuery.affectedRows === 0) throw new Error("Unable to create funnel")

        return {
          status: "SUCCESS",
          message: "New funnel created"
        }
      }

      const [updateFunnelQuery] = await ctx.db.update(FunnelTable).set(input.funnel).where(eq(FunnelTable.id, input.funnelId))

      if (updateFunnelQuery.affectedRows === 0) throw new Error("Unable to update funnel")

      return {
        status: "SUCCESS",
        message: "Funnel created"
      }
    } catch (error) {
      return procedureError(error)
    }
  })
});
