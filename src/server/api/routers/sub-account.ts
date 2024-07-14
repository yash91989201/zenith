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
import { DeleteSubAccountByIdSchema, GetSubAccountByIdSchema, UpsertSubAccountPermissionSchema, UpsertSubaccountProcedureSchema } from "@/lib/schema";
// UTILS
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
// TYPES
import type { DeleteSubAccountByIdType, UpsertSubAccountPermissionType, UpsertSubaccountProcedureType } from "@/lib/types";
import { procedureError } from "@/server/helpers";

export const subAccountRouter = createTRPCRouter({
  getById: protectedProcedure.input(GetSubAccountByIdSchema).query(({ ctx, input }) => {
    return ctx.db.query.SubAccountTable.findFirst({ where: eq(SubAccountTable.id, input.id) })
  }),

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
            { name: 'Dashboard', icon: 'category', link: `/subaccount/${subAccountId}`, subAccountId, order: 1 },
            { name: 'Launchpad', icon: 'clipboard', link: `/subaccount/${subAccountId}/launchpad`, subAccountId, order: 2 },
            { name: 'Funnels', icon: 'pipelines', link: `/subaccount/${subAccountId}/funnels`, subAccountId, order: 3 },
            { name: 'Automations', icon: 'chip', link: `/subaccount/${subAccountId}/automations`, subAccountId, order: 4 },
            { name: 'Pipelines', icon: 'flag', link: `/subaccount/${subAccountId}/pipelines`, subAccountId, order: 5 },
            { name: 'Media', icon: 'database', link: `/subaccount/${subAccountId}/media`, subAccountId, order: 6 },
            { name: 'Contacts', icon: 'person', link: `/subaccount/${subAccountId}/contacts`, subAccountId, order: 7 },
            { name: 'Settings', icon: 'settings', link: `/subaccount/${subAccountId}/settings`, subAccountId, order: 8 },
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
  }),

  deleteSubAccount: protectedProcedure.input(DeleteSubAccountByIdSchema).mutation(async ({ ctx, input }): ProcedureStatus<DeleteSubAccountByIdType> => {
    try {

      const deleteSubAccountRes = await ctx.db.transaction(async (trx): ProcedureStatus<DeleteSubAccountByIdType> => {
        try {
          const [deleteSubAccountQuery] = await trx.delete(SubAccountTable).where(eq(SubAccountTable.id, input.id))
          if (deleteSubAccountQuery.affectedRows === 0) throw new Error("Unable to delete sub account")

          // const [deleteSubAccountTags] = await trx.delete(TagTable).where(eq(TagTable.subAccountId, input.id))
          // if (deleteSubAccountTags.affectedRows === 0) throw new Error("Unable to delete sub account")

          // const [deleteSubAccountMedia] = await trx.delete(TagTable).where(eq(TagTable.subAccountId, input.id))
          // if (deleteSubAccountMedia.affectedRows === 0) throw new Error("Unable to delete sub account")

          // const [deleteSubAccountFunnels] = await trx.delete(TagTable).where(eq(TagTable.subAccountId, input.id))
          // if (deleteSubAccountFunnels.affectedRows === 0) throw new Error("Unable to delete sub account")

          // const [deleteSubAccountContacts] = await trx.delete(TagTable).where(eq(TagTable.subAccountId, input.id))
          // if (deleteSubAccountContacts.affectedRows === 0) throw new Error("Unable to delete sub account")

          // const [deleteSubAccountTriggers] = await trx.delete(TagTable).where(eq(TagTable.subAccountId, input.id))
          // if (deleteSubAccountTriggers.affectedRows === 0) throw new Error("Unable to delete sub account")

          // const [deleteSubAccountPipelines] = await trx.delete(TagTable).where(eq(TagTable.subAccountId, input.id))
          // if (deleteSubAccountPipelines.affectedRows === 0) throw new Error("Unable to delete sub account")

          // const [deleteSubAccountPermissions] = await trx.delete(TagTable).where(eq(TagTable.subAccountId, input.id))
          // if (deleteSubAccountPermissions.affectedRows === 0) throw new Error("Unable to delete sub account")

          // const [deleteSubAccountAutomations] = await trx.delete(TagTable).where(eq(TagTable.subAccountId, input.id))
          // if (deleteSubAccountAutomations.affectedRows === 0) throw new Error("Unable to delete sub account")

          // const [deleteSubAccountNotifications] = await trx.delete(TagTable).where(eq(TagTable.subAccountId, input.id))
          // if (deleteSubAccountNotifications.affectedRows === 0) throw new Error("Unable to delete sub account")

          // const [deleteSubAccountSidebarOptions] = await trx.delete(TagTable).where(eq(TagTable.subAccountId, input.id))
          // if (deleteSubAccountSidebarOptions.affectedRows === 0) throw new Error("Unable to delete sub account")

          return {
            status: "SUCCESS",
            message: "Deleted subaccount and related resources"
          }
        } catch (error) {
          trx.rollback()
          return procedureError(error)
        }
      })

      return deleteSubAccountRes
    } catch (error) {
      return procedureError(error)
    }
  }),
});
