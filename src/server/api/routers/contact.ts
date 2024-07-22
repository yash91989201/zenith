import { asc, eq, like } from "drizzle-orm";
// DB SCHEMAS
import { ContactTable, SubAccountTable } from "@/server/db/schema";
// SCHEMAS
import { CreateContactSchema, GetContactByNameSchema, GetContactSubAccountSchema } from "@/lib/schema";
// UTILS
import { procedureError } from "@/server/helpers";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// TYPES
import type { CreateContactType } from "@/lib/types";

export const contactRouter = createTRPCRouter({
  getByName: protectedProcedure.input(GetContactByNameSchema).query(({ ctx, input }) => {
    return ctx.db.query.ContactTable.findMany({
      where: like(ContactTable.name, `%${input.name.toLowerCase()}%`),
    })
  }),

  getSubAccount: protectedProcedure.input(GetContactSubAccountSchema).query(({ ctx, input }) => {
    return ctx.db.query.SubAccountTable.findFirst({
      where: eq(SubAccountTable.id, input.subAccountId),
      with: {
        contacts: {
          with: {
            tickets: true,
          }
        }
      },
      orderBy: [asc(SubAccountTable.createdAt)]
    },
    )
  }),

  create: protectedProcedure.input(CreateContactSchema).mutation(async ({ ctx, input }): ProcedureStatus<CreateContactType> => {
    try {
      const [createContactQuery] = await ctx.db.insert(ContactTable).values(input)

      if (createContactQuery.affectedRows === 0) throw new Error("Unable to create contact")

      return {
        status: "SUCCESS",
        message: "Contact created successfully"
      }
    } catch (error) {
      return procedureError<CreateContactType>(error)
    }
  })
});
