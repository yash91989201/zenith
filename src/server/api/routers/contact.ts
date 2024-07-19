import { like } from "drizzle-orm";
// DB SCHEMAS
import { ContactTable } from "@/server/db/schema";
// SCHEMAS
import { GetContactByNameSchema } from "@/lib/schema";
// UTILS
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// TYPES

export const contactRouter = createTRPCRouter({
  getByName: protectedProcedure.input(GetContactByNameSchema).query(({ ctx, input }) => {
    return ctx.db.query.ContactTable.findMany({
      where: like(ContactTable.name, `%${input.name.toLowerCase()}%`),
    })
  })
});
