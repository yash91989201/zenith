import { eq } from "drizzle-orm";
// DB SCHEMAS
import { TagTable } from "@/server/db/schema";
// SCHEMAS
import { GetAllTagsSchema, TagByIdSchema, TagInsertSchema, TagSchema } from "@/lib/schema";
// UTILS
import { procedureError } from "@/server/helpers";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// TYPES
import type { TagByIdType, TagInsertType, TagType } from "@/lib/types";

export const tagRouter = createTRPCRouter({
  getAll: protectedProcedure.input(GetAllTagsSchema).query(({ ctx, input }) => {
    return ctx.db.query.TagTable.findMany({ where: eq(TagTable.subAccountId, input.subAccountId) })
  }),

  create: protectedProcedure.input(TagInsertSchema).mutation(async ({ ctx, input }): ProcedureStatus<TagInsertType> => {
    try {
      const [createTagQuery] = await ctx.db.insert(TagTable).values(input)
      if (createTagQuery.affectedRows === 0) throw new Error("Unable to create tag")

      return {
        status: "SUCCESS",
        message: "Tag created"
      }
    } catch (error) {
      return procedureError<TagInsertType>(error)
    }
  }),

  update: protectedProcedure.input(TagSchema).mutation(async ({ ctx, input }): ProcedureStatus<TagType> => {
    try {
      const [updateTagQuery] = await ctx.db.update(TagTable).set(input).where(eq(TagTable.id, input.id))
      if (updateTagQuery.affectedRows === 0) throw new Error("Unable to update tag")

      return {
        status: "SUCCESS",
        message: "Tag edited successfully"
      }
    } catch (error) {
      return procedureError<TagType>(error)
    }
  }),

  delete: protectedProcedure.input(TagByIdSchema).mutation(async ({ ctx, input }): ProcedureStatus<TagByIdType> => {
    try {
      const [deleteTagQuery] = await ctx.db.delete(TagTable).where(eq(TagTable.id, input.tagId))
      if (deleteTagQuery.affectedRows === 0) throw new Error("Unable to delete tag")

      return {
        status: "SUCCESS",
        message: "Tag was deleted"
      }
    } catch (error) {
      return procedureError<TagByIdType>(error)
    }
  }),
});