import { count, eq, inArray } from "drizzle-orm";
// DB SCHEMAS
import { LaneTable, TagTable, TicketsToTagsTable, TicketTable } from "@/server/db/schema";
// SCHEMAS
import { ChangeTicketLaneSchema, GetTicketsWithTagsSchema, TicketSchema, UpdateTicketOrderSchema, UpsertTicketSchema } from "@/lib/schema";
// UTILS
import { procedureError } from "@/server/helpers";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// TYPES
import type { ChangeTicketLaneType, TicketType, UpdateTicketOrdertype, UpsertTicketType } from "@/lib/types";
import { createId } from "@paralleldrive/cuid2";

export const ticketRouter = createTRPCRouter({
  getTicketsWithTags: protectedProcedure.input(GetTicketsWithTagsSchema).query(async ({ ctx, input }) => {

    const lanes = await ctx.db.query.LaneTable.findMany({
      where: eq(LaneTable.pipelineId, input.pipelineId),
      columns: {
        id: true
      }
    })

    const laneIds = lanes.map(lane => lane.id)

    return ctx.db.query.TicketTable.findMany({
      where: inArray(TicketTable.laneId, laneIds),
      with: {
        tags: true,
        assigned: true,
        customer: true,
      },
    });

  }),

  updateOrder: protectedProcedure.input(UpdateTicketOrderSchema).mutation(async ({ ctx, input: { tickets } }): ProcedureStatus<UpdateTicketOrdertype> => {
    try {
      await ctx.db.transaction(async (trx) => {
        try {
          await Promise.all(tickets.map(async (ticket) => {
            await trx.update(TicketTable).set(ticket).where(eq(TicketTable.id, ticket.id));
          }));
        } catch (error) {
          trx.rollback()
          throw new Error("Rollback : Unable to update ticket order");
        }
      });

      return {
        status: "SUCCESS",
        message: "Tickets order updated"
      }
    } catch (error) {
      return procedureError(error)
    }
  }),

  upsertTicket: protectedProcedure.input(UpsertTicketSchema).mutation(async ({ ctx, input }): ProcedureStatus<UpsertTicketType> => {
    try {
      const { tags } = input
      const ticket = await ctx.db.query.TicketTable.findFirst({ where: eq(TicketTable.id, input.ticket?.id ?? "") })

      if (ticket) {

        const [updateTicketQuery] = await ctx.db.update(TicketTable).set(input.ticket).where(eq(TicketTable.id, ticket.id))

        if (updateTicketQuery.affectedRows === 0) throw new Error("Unable to update ticket")

        const updateTagsAffectedRows = await Promise.all(tags.map(async (tag) => {
          const [updateTagQuery] = await ctx.db.update(TagTable).set(tag).where(eq(TagTable.id, tag?.id ?? ""))
          return updateTagQuery.affectedRows
        }))

        const updatedTags = updateTagsAffectedRows.reduce((total, affectedRows) => total + affectedRows, 0)

        if (updatedTags !== tags.length) throw new Error("Unable to update ticket tags")

        return {
          status: "SUCCESS",
          message: "Updated ticket with their tags"
        }

      }

      const tickets = await ctx.db
        .select({
          order: count()
        })
        .from(TicketTable)
        .where(
          eq(TicketTable.laneId, input.ticket.laneId)
        )

      const createTicketAndTagsTransactionResult = await ctx.db.transaction(async (trx): ProcedureStatus<UpsertTicketType> => {
        try {
          const ticketId = createId()
          const [createTicketQuery] = await trx.insert(TicketTable).values({
            ...input.ticket,
            id: ticketId,
            order: tickets[0]?.order
          })

          if (createTicketQuery.affectedRows === 0) throw new Error("Unable to create ticket")

          if (tags.length > 0) {
            // create fill data for tickets-to-tags junction table
            const ticketsToTagsRows = tags.map(tag => ({ ticketId, tagId: tag.id }))
            const [createTicketToTagsQuery] = await trx.insert(TicketsToTagsTable).values(ticketsToTagsRows)

            if (createTicketToTagsQuery.affectedRows === 0) throw new Error("Unable to relate tags to tickets")
          }

          return {
            status: "SUCCESS",
            message: "Ticket Created"
          }

        } catch (error) {
          trx.rollback()
          return procedureError(error)
        }
      })

      return createTicketAndTagsTransactionResult
    } catch (error) {
      return procedureError<UpsertTicketType>(error)
    }
  }),

  changeLane: protectedProcedure.input(ChangeTicketLaneSchema).mutation(async ({ ctx, input }): ProcedureStatus<ChangeTicketLaneType> => {
    try {

      const laneTickets = await ctx.db.select({
        count: count()
      })
        .from(TicketTable)
        .where(eq(TicketTable.laneId, input.laneId))

      const [changeTicketLaneQuery] = await ctx.db.update(TicketTable)
        .set({
          order: laneTickets[0]?.count,
          laneId: input.laneId
        })
        .where(eq(TicketTable.id, input.ticketId))

      if (changeTicketLaneQuery.affectedRows === 0) throw new Error("Unable to change ticket lane")

      return {
        status: "SUCCESS",
        message: "Ticket lane changed"
      }
    } catch (error) {
      return procedureError<ChangeTicketLaneType>(error)
    }
  }),
  deleteTicket: protectedProcedure.input(TicketSchema).mutation(async ({ ctx, input }): ProcedureStatus<TicketType> => {
    try {
      const tickets = await ctx.db.query.TicketTable.findMany({
        where: eq(TicketTable.laneId, input.laneId)
      })

      if ((tickets.length - 1) === input.order) {
        const [deleteTicketQuery] = await ctx.db.delete(TicketTable).where(eq(TicketTable.id, input.id))
        if (deleteTicketQuery.affectedRows === 0) throw new Error("Unable to delete ticket")

        return {
          status: "SUCCESS",
          message: `'${input.name}' ticket deleted`
        }
      }

      const updatedTicketsOrder = tickets.filter(ticket => ticket.id === input.id).map((ticket, index) => ({ ...ticket, order: index }))

      const [deleteTicketQuery] = await ctx.db.delete(TicketTable).where(eq(TicketTable.id, input.id))
      if (deleteTicketQuery.affectedRows === 0) throw new Error("Unable to delete ticket")

      await Promise.all(updatedTicketsOrder.map(async (ticket) => {
        await ctx.db.update(TicketTable).set({ order: ticket.order }).where(eq(TicketTable.id, ticket.id))
      }))

      return {
        status: "SUCCESS",
        message: "Ticket deleted"
      }
    } catch (error) {
      return procedureError<TicketType>(error)
    }
  })
});
