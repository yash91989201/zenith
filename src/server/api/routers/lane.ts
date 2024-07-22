import { asc, count, eq } from "drizzle-orm";
// DB SCHEMAS
import { LaneTable, TicketTable } from "@/server/db/schema";
// SCHEMAS
import { ChangeLanePipelineSchema, DeleteLaneSchema, GetLaneDetailSchema, LaneInsertSchema, UpdateLaneOrderSchema } from "@/lib/schema";
// UTILS
import { procedureError } from "@/server/helpers";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// TYPES
import type { ChangeLanePipelineType, DeleteLaneType, LaneDetailType, LaneInsertType, UpdateLaneOrderType } from "@/lib/types";

export const laneRouter = createTRPCRouter({
  getDetail: protectedProcedure.input(GetLaneDetailSchema).query(async ({ ctx, input }) => {
    const lanesWithDetailQuery = ctx.db.query.LaneTable.findMany({
      where: eq(LaneTable.pipelineId, input.pipelineId),
      with: {
        tickets: {
          with: {
            tags: {
              with: {
                tag: true
              },
            },
            assigned: true,
            customer: true,
          },
          orderBy: [asc(TicketTable.order)],
        },
      },
      orderBy: [asc(LaneTable.order)],
    }).prepare()

    const iterator = lanesWithDetailQuery.iterator()

    const lanesWithDetail: LaneDetailType[] = [];
    for await (const row of iterator) {

      const lanesWithCorrectTagsStructure = {
        ...row,
        tickets: row.tickets.map(ticket => ({
          ...ticket,
          tags: ticket.tags.map(tag => tag.tag)
        }))
      };

      lanesWithDetail.push(lanesWithCorrectTagsStructure)
    }

    return lanesWithDetail
  }),

  upsert: protectedProcedure.input(LaneInsertSchema).mutation(async ({ ctx, input }): ProcedureStatus<LaneInsertType> => {
    try {
      const lane = await ctx.db.query.LaneTable.findFirst({ where: eq(LaneTable.id, input?.id ?? "") })

      if (lane) {
        const [updateLaneQuery] = await ctx.db.update(LaneTable).set(input).where(eq(LaneTable.id, lane.id))

        if (updateLaneQuery.affectedRows === 0) throw new Error("Unable to update lane")

        return {
          status: "SUCCESS",
          message: "Lane updated successfully"
        }
      }

      const pipelineLanes = await ctx.db
        .select({
          lanes: count()
        })
        .from(LaneTable)
        .where(
          eq(LaneTable.pipelineId, input.pipelineId)
        )

      const [createLaneQuery] = await ctx.db.insert(LaneTable).values({
        ...input,
        order: pipelineLanes[0]?.lanes
      })

      if (createLaneQuery.affectedRows === 0) throw new Error("Unable to create new lane")

      return {
        status: "SUCCESS",
        message: "Lane created successfully"
      }
    } catch (error) {
      return procedureError(error)
    }
  }),

  updateOrder: protectedProcedure.input(UpdateLaneOrderSchema).mutation(async ({ ctx, input: { lanes } }): ProcedureStatus<UpdateLaneOrderType> => {
    try {

      await ctx.db.transaction(async (trx) => {
        try {
          await Promise.all(lanes.map(async (lane) => {
            await trx.update(LaneTable).set(lane).where(eq(LaneTable.id, lane.id));
          }));
        } catch (error) {
          trx.rollback()
          throw new Error("Rollback : Unable to update lane");
        }
      });

      return {
        status: "SUCCESS",
        message: "Lane order updated"
      }
    } catch (error) {
      return procedureError(error)
    }
  }),

  changePipeline: protectedProcedure.input(ChangeLanePipelineSchema).mutation(async ({ ctx, input }): ProcedureStatus<ChangeLanePipelineType> => {
    try {

      const [changeLanePipelineQuery] = await ctx.db.update(LaneTable).set({
        pipelineId: input.pipelineId
      }).where(eq(LaneTable.id, input.laneId))

      if (changeLanePipelineQuery.affectedRows === 0) throw new Error("Unable to change lane")

      return {
        status: "SUCCESS",
        message: "Moved lane to another pipeline"
      }

    } catch (error) {
      return procedureError<ChangeLanePipelineType>(error)
    }
  }),

  delete: protectedProcedure.input(DeleteLaneSchema).mutation(async ({ ctx, input }): ProcedureStatus<DeleteLaneType> => {
    try {

      const [deleteLaneQuery] = await ctx.db.delete(LaneTable).where(eq(LaneTable.id, input.laneId))

      if (deleteLaneQuery.affectedRows === 0) throw new Error("Unable to delete lane")

      return {
        status: "SUCCESS",
        message: "Lane deleted"
      }
    } catch (error) {
      console.log("laneid", input.laneId)
      console.log(error)
      return procedureError(error)
    }
  })
});
