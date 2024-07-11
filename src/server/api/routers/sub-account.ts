import { and, eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
// DB SCHEMAS
import {
  UserTable,
  PipelineTable,
  SubAccountTable,
  PermissionTable,
  SubAccountSidebarOptionTable,
} from "@/server/db/schema";
// SCHEMAS
import { UpsertSubAccountPermissionSchema, UpsertSubaccountProcedureSchema } from "@/lib/schema";
// UTILS
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// TYPES
import type { UpsertSubAccountPermissionType, UpsertSubaccountProcedureType } from "@/lib/types";
import { procedureError } from "@/server/helpers";

export const subAccountRouter = createTRPCRouter({
  upsertSubAccount: protectedProcedure.input(UpsertSubaccountProcedureSchema).mutation(async ({ ctx, input: subaccount }): ProcedureStatus<UpsertSubaccountProcedureType> => {
    try {

      const agencyOwner = await ctx.db.query.UserTable.findFirst({
        where: and(
          eq(UserTable.id, ctx.session.user.id),
          eq(UserTable.role, "AGENCY_OWNER")
        )
      })

      if (!agencyOwner) throw new Error("Un-authorized: not agency owner")


      const subAccountExists = await ctx.db
        .query.
        SubAccountTable.
        findFirst(
          {
            where: eq(SubAccountTable.id, subaccount?.id ?? "")
          }
        )

      if (subAccountExists) {
        const [updateSubaccountQuery] = await ctx.db
          .update(SubAccountTable)
          .set(subaccount)
          .where(
            eq(SubAccountTable.id, subaccount?.id ?? "")
          )

        if (updateSubaccountQuery.affectedRows === 0) throw new Error("Unable to update subaccount")

        return {
          status: "SUCCESS",
          message: "Subaccount updated",
        }
      }

      const subAccountId = await ctx.db.transaction(async (trx) => {
        try {
          const subAccountId = createId()
          const permissionId = createId()
          const [createSubaccountQuery] = await trx.insert(SubAccountTable).values({ id: subAccountId, ...subaccount })
          if (createSubaccountQuery.affectedRows === 0) throw new Error()

          const [createPermissionQuery] = await trx.insert(PermissionTable).values({
            id: permissionId,
            access: true,
            email: agencyOwner.email,
            subAccountId
          })

          if (createPermissionQuery.affectedRows === 0) throw new Error()

          const [createPipelineQuery] = await trx.insert(PipelineTable).values({
            name: "Lead Cycle",
            subAccountId,
          })

          if (createPipelineQuery.affectedRows === 0) throw new Error()

          const [createSubAccountSidebarOptionsQuery] = await trx.insert(SubAccountSidebarOptionTable).values([
            { name: 'Launchpad', icon: 'clipboard', link: `/subaccount/${subAccountId}/launchpad`, subAccountId },
            { name: 'Settings', icon: 'settings', link: `/subaccount/${subAccountId}/settings`, subAccountId },
            { name: 'Funnels', icon: 'pipelines', link: `/subaccount/${subAccountId}/funnels`, subAccountId },
            { name: 'Media', icon: 'database', link: `/subaccount/${subAccountId}/media`, subAccountId },
            { name: 'Automations', icon: 'chip', link: `/subaccount/${subAccountId}/automations`, subAccountId },
            { name: 'Pipelines', icon: 'flag', link: `/subaccount/${subAccountId}/pipelines`, subAccountId },
            { name: 'Contacts', icon: 'person', link: `/subaccount/${subAccountId}/contacts`, subAccountId },
            { name: 'Dashboard', icon: 'category', link: `/subaccount/${subAccountId}`, subAccountId },
          ])

          if (createSubAccountSidebarOptionsQuery.affectedRows === 0) throw new Error()

          return subAccountId;

        } catch (error) {
          trx.rollback()
          throw new Error("Unable to create subaccount")
        }
      })

      return {
        status: "SUCCESS",
        message: "Subaccount created",
        data: {
          id: subAccountId
        }
      }

    } catch (error) {
      return procedureError(error)
    }
  }),

  upsertPermission: protectedProcedure.input(UpsertSubAccountPermissionSchema).mutation(async ({ ctx, input }): ProcedureStatus<UpsertSubAccountPermissionType> => {
    try {

      if (input?.permissionId) {
        const [updatePermissionQuery] = await ctx.db.update(PermissionTable).set({
          access: input.access,
        })
          .where(eq(PermissionTable.id, input?.permissionId))

        if (updatePermissionQuery.affectedRows === 0) throw new Error("Unable to update permission, try again.")

        return {
          status: "SUCCESS",
          message: "User sub account permission updated"
        }
      }

      const [createPermissionQueery] = await ctx.db.insert(PermissionTable).values({
        email: input.email,
        subAccountId: input.subAccountId,
        access: input.access,
      })

      if (createPermissionQueery.affectedRows === 0) throw new Error("Unable to create sub account permission")


      return {
        status: "SUCCESS",
        message: "User sub account permission updated"
      }
    } catch (error) {
      return procedureError(error)
    }
  })
});