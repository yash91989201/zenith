import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
// DB SCHEMAS
import {
  UserTable,
  AgencyTable,
  AgencySidebarOptionTable,
} from "@/server/db/schema";
// SCHEMAS
import {
  GetAgencyById,
  DeleteAgencySchema,
  UpdateAgencyGoalSchema,
  InitUserProcedureSchema,
  UpsertAgencyProcedureSchema,
} from "@/lib/schema";
// UTILS
import { procedureError } from "@/server/helpers";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// TYPES
import type { DeleteAgencyType, InitUserProcedureType, UpdateAgencyGoalType, UpsetAgencyProcedureType } from "@/lib/types";

export const agencyRouter = createTRPCRouter({

  getById: protectedProcedure.input(GetAgencyById).query(({ ctx, input }) => {
    return ctx.db
      .query
      .AgencyTable
      .findFirst({
        where: eq(AgencyTable.id, input.agencyId),
        with: {
          subAccounts: true,
        }
      },
      )
  }),

  initUser: protectedProcedure.input(InitUserProcedureSchema).mutation(async ({ ctx, input }): ProcedureStatus<InitUserProcedureType> => {

    try {
      // update user agency id 
      const [updateUserAgencyIdQuery] = await ctx.db
        .update(UserTable)
        .set(input)
        .where(
          eq(UserTable.email, ctx.session.user.email)
        )

      if (updateUserAgencyIdQuery.affectedRows === 0) throw new Error("User Init failed")

      return {
        status: "SUCCESS",
        message: "User initialized"
      }
    } catch (error) {
      return procedureError(error)
    }
  }),

  upsertAgency: protectedProcedure.input(UpsertAgencyProcedureSchema).mutation(async ({ ctx, input: agency }): ProcedureStatus<UpsetAgencyProcedureType> => {
    try {
      if (!agency.companyEmail) throw new Error()

      const agencyExists = await ctx.db.query.AgencyTable.findFirst({ where: eq(AgencyTable.id, agency?.id ?? "") })

      if (agencyExists) {
        const [updateAgencyQuery] = await ctx.db
          .update(AgencyTable)
          .set(agency)
          .where(
            eq(AgencyTable.id, agencyExists.id)
          )

        if (updateAgencyQuery.affectedRows === 0) throw new Error("Unable to update agency")

        return {
          status: "SUCCESS",
          message: "Agency updated"
        }
      }

      const agencyId = createId()
      const { price: _price, ...agencyWithoutPrice } = agency

      await ctx.db.transaction(async (trx) => {
        try {
          const [createAgencyQuery] = await trx.insert(AgencyTable).values({ id: agencyId, ...agencyWithoutPrice })

          if (createAgencyQuery.affectedRows === 0) throw new Error()

          const [updateUserAgencyQuery] = await trx.update(UserTable).set({ agencyId }).where(eq(UserTable.id, ctx.session.user.id))

          if (updateUserAgencyQuery.affectedRows === 0) throw new Error()

          const [insertAgencySidebarOptionsQuery] = await trx.insert(AgencySidebarOptionTable).values([
            { name: "Dashboard", icon: "category", link: `/agency/${agencyId}/`, agencyId, order: 1 },
            { name: "Launchpad", icon: "clipboard", link: `/agency/${agencyId}/launchpad`, agencyId, order: 2 },
            { name: "Team", icon: "shield", link: `/agency/${agencyId}/team`, agencyId, order: 3 },
            { name: "Sub Accounts", icon: "person", link: `/agency/${agencyId}/all-subaccounts`, agencyId, order: 4 },
            { name: "Billing", icon: "payment", link: `/agency/${agencyId}/billing`, agencyId, order: 5 },
            { name: "Settings", icon: "settings", link: `/agency/${agencyId}/settings`, agencyId, order: 6 },
          ])

          if (insertAgencySidebarOptionsQuery.affectedRows === 0) throw new Error()

        } catch (error) {
          trx.rollback()
          throw new Error("Unable to create agency")
        }
      })

      return {
        status: "SUCCESS",
        message: "Agency created"
      }
    } catch (error) {
      return procedureError(error)
    }
  }),

  updateAgencyGoal: protectedProcedure.input(UpdateAgencyGoalSchema).mutation(async ({ ctx, input }): ProcedureStatus<UpdateAgencyGoalType> => {
    const { agencyId, goal } = input

    try {
      const [updateAgencyGoalQuery] = await ctx.db.update(AgencyTable).set({
        goal
      }).where(eq(AgencyTable.id, agencyId))

      if (updateAgencyGoalQuery.affectedRows === 0) {
        return {
          status: "FAILED",
          message: "Unable to update agency goal, try again."
        }
      }

      return {
        status: "SUCCESS",
        message: "Agency goal updated"
      }
    } catch (error) {
      return {
        status: "FAILED",
        message: "Unable to update agency goal, try again."
      }
    }
  }),

  deleteAgency: protectedProcedure.input(DeleteAgencySchema).mutation(async ({ ctx, input }): ProcedureStatus<DeleteAgencyType> => {

    try {
      const [deleteAgencyQuery] = await ctx.db.delete(AgencyTable).where(eq(AgencyTable.id, input.agencyId))

      if (deleteAgencyQuery.affectedRows === 0) {
        return {
          status: "FAILED",
          message: "Unable to delete agency, try again"
        }
      }

      return {
        status: "SUCCESS",
        message: "Agency deleted succesfully"
      }
    } catch (error) {
      return {
        status: "FAILED",
        message: "Unable to delete agency, try again"
      }
    }

  })
});
