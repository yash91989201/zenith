import { eq } from "drizzle-orm";
// DB SCHEMAS
import { MediaTable, SubAccountTable } from "@/server/db/schema";
// SCHEMAS
import { GetSubAccountMediaSchema, SaveMediaDataSchema } from "@/lib/schema";
// UTILS
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { SaveMediaDataType } from "@/lib/types";
import { procedureError } from "@/server/helpers";

export const mediaRouter = createTRPCRouter({
  getSubAccountMedia: protectedProcedure.input(GetSubAccountMediaSchema).query(({ ctx, input }) => {
    return ctx.db.query.SubAccountTable.findFirst({
      where: eq(SubAccountTable.id, input.subAccountId),
      with: {
        media: true
      }
    })
  }),
  saveMediaData: protectedProcedure.input(SaveMediaDataSchema).mutation(async ({ ctx, input }): ProcedureStatus<SaveMediaDataType> => {
    try {

      const [saveMediaDataQuery] = await ctx.db.insert(MediaTable).values(input)

      if (saveMediaDataQuery.affectedRows === 0) throw new Error("Unable to save media data in db.")

      return {
        status: "SUCCESS",
        message: "Media data stored"
      }
    } catch (error) {
      return procedureError(error)
    }
  })
});
