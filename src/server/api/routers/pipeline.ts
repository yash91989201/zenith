import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
// DB SCHEMAS
import { PipelineTable } from "@/server/db/schema";
// SCHEMAS
import { DeletePipelineByIdSchema, GetPipelineByIdSchema, GetPipelineBySubAccountIdSchema, PipelineInsertSchema } from "@/lib/schema";
// UTILS
import { procedureError } from "@/server/helpers";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// TYPES
import type { DeletePipelineByIdType, PipelineInsertType } from "@/lib/types";

export const pipelineRouter = createTRPCRouter({
  getById: protectedProcedure.input(GetPipelineByIdSchema).query(({ ctx, input }) => {
    return ctx.db.query.PipelineTable.findFirst({
      where: eq(PipelineTable.id, input.id)
    })
  }),

  getBySubAccountId: protectedProcedure.input(GetPipelineBySubAccountIdSchema).query(({ ctx, input }) => {
    return ctx.db.query.PipelineTable.findFirst({
      where: eq(PipelineTable.subAccountId, input.subAccountId)
    })
  }),

  getSubAccountPipelines: protectedProcedure.input(GetPipelineBySubAccountIdSchema).query(({ ctx, input }) => {
    return ctx.db.query.PipelineTable.findMany({
      where: eq(PipelineTable.subAccountId, input.subAccountId)
    })
  }),

  create: protectedProcedure.input(PipelineInsertSchema).mutation(async ({ ctx, input }): ProcedureStatus<PipelineInsertType> => {
    try {
      const pipelineId = createId()
      const [createPipelineQuery] = await ctx.db.insert(PipelineTable).values({
        id: pipelineId,
        ...input
      })
      if (createPipelineQuery.affectedRows === 0) throw new Error("Unable to create pipeline")

      return {
        status: "SUCCESS",
        message: "Pipeline created",
        data: {
          id: pipelineId
        }
      }
    } catch (error) {
      return procedureError(error)
    }
  }),

  upsert: protectedProcedure.input(PipelineInsertSchema).mutation(async ({ ctx, input }): ProcedureStatus<PipelineInsertType> => {
    try {

      const pipeline = await ctx.db.query.PipelineTable.findFirst({ where: eq(PipelineTable.id, input?.id ?? "") })

      if (!pipeline) {
        const [createPipelineQuery] = await ctx.db.insert(PipelineTable).values(input)
        if (createPipelineQuery.affectedRows === 0) throw new Error("Unable to create new pipeline")
        return {
          status: "SUCCESS",
          message: "Pipeline created"
        }
      }

      const [updatePipelineQuery] = await ctx.db.update(PipelineTable).set(input).where(eq(PipelineTable.id, pipeline.id))

      if (updatePipelineQuery.affectedRows === 0) throw new Error("Unable to update pipeline")

      return {
        status: "SUCCESS",
        message: "Pipeline updated"
      }
    } catch (error) {
      return procedureError(error)
    }
  }),

  delete: protectedProcedure.input(DeletePipelineByIdSchema).mutation(async ({ ctx, input }): ProcedureStatus<DeletePipelineByIdType> => {
    try {
      const [deletePipelineQuery] = await ctx.db.delete(PipelineTable).where(eq(PipelineTable.id, input.id))

      if (deletePipelineQuery.affectedRows === 0) throw new Error("Unable to delete pipeline")

      return {
        status: "SUCCESS",
        message: "Pipeline deleted"
      }
    } catch (error) {
      return procedureError(error)
    }
  })
});
