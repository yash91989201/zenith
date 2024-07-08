import { eq, sql } from "drizzle-orm";
// SCHEMAS
import { UpdateUsernameSchema } from "@/lib/schema";
// UTILS
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// DB SCHEMAS
import { SessionTable, UserTable } from "@/server/db/schema";

export const userRouter = createTRPCRouter({
  getSessionList: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.SessionTable.findMany({
      where: eq(SessionTable.userId, ctx.session.user.id),
      extras: {
        current: sql<boolean>`${SessionTable.id} = ${ctx.session.session.id}`.as("current")
      }
    })
  }),
  updateName: protectedProcedure.input(UpdateUsernameSchema).mutation(async ({ ctx, input }) => {
    const [updateNameQuery] = await ctx.db.update(UserTable).set({
      name: input.name
    }).where(eq(UserTable.id, ctx.session.user.id))

    if (updateNameQuery.affectedRows === 0) {
      return {
        status: "FAILED",
        message: "Unable to update username"
      }
    }
    return {
      status: "SUCCESS",
      message: "Username updated successfully"
    }
  })
});
