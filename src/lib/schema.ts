import z from "zod"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
// DB TABLES
import {
  UserTable,
  PermissionTable,
  AgencyTable,
  SubAccountTable,
  TagTable,
  PipelineTable,
  LaneTable,
  TicketTable,
  TagsToTicketsTable,
  TriggerTable,
  AutomationTable,
  AutomationInstanceTable,
  ActionTable,
  ContactTable,
  MediaTable,
  FunnelTable,
  ClassNameTable,
  FunnelPageTable,
  AgencySidebarOptionTable,
  SubAccountSidebarOptionTable,
  InvitationTable,
  NotificationTable,
  SubscriptionTable,
  AddOnTable,
} from "@/server/db/schema"

// DB TABLES SCHEMAS
export const UserSchema = createSelectSchema(UserTable)
export const PermissionSchema = createSelectSchema(PermissionTable)
export const AgencySchema = createSelectSchema(AgencyTable)
export const SubAccountSchema = createSelectSchema(SubAccountTable)
export const TagSchema = createSelectSchema(TagTable)
export const PipelineSchema = createSelectSchema(PipelineTable)
export const LaneSchema = createSelectSchema(LaneTable)
export const TicketSchema = createSelectSchema(TicketTable)
export const TagsToTicketsSchema = createSelectSchema(TagsToTicketsTable)
export const TriggerSchema = createSelectSchema(TriggerTable)
export const AutomationSchema = createSelectSchema(AutomationTable)
export const AutomationInstanceSchema = createSelectSchema(AutomationInstanceTable)
export const ActionSchema = createSelectSchema(ActionTable)
export const ContactSchema = createSelectSchema(ContactTable)
export const MediaSchema = createSelectSchema(MediaTable)
export const FunnelSchema = createSelectSchema(FunnelTable)
export const ClassNameSchema = createSelectSchema(ClassNameTable)
export const FunnelPageSchema = createSelectSchema(FunnelPageTable)
export const AgencySidebarOptionSchema = createSelectSchema(AgencySidebarOptionTable)
export const SubAccountSidebarOptionSchema = createSelectSchema(SubAccountSidebarOptionTable)
export const InvitationSchema = createSelectSchema(InvitationTable)
export const NotificationSchema = createSelectSchema(NotificationTable)
export const SubscriptionSchema = createSelectSchema(SubscriptionTable)
export const AddOnSchema = createSelectSchema(AddOnTable)

// DB TABLES INSERT SCHEMAS
export const UserInsertSchema = createInsertSchema(UserTable)


// AUTH SCHEMAS
export const CredsSignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const CredsSignUpSchema = z.object({
  name: z.string().min(6, { message: "Enter your full name" }),
  email: z.string().email(),
  password: z.string(),
})
