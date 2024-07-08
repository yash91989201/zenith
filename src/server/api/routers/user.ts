import { eq, sql } from "drizzle-orm";
// UTILS
import { SessionTable } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getSessionList: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.SessionTable.findMany({
      where: eq(SessionTable.userId, ctx.session.user.id),
      extras: {
        current: sql<boolean>`${SessionTable.id} = ${ctx.session.session.id}`.as("current")
      }
    })
  })
});
