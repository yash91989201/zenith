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
  OAuthAccountTable,
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
export const OAuthAccountSchema = createSelectSchema(OAuthAccountTable)


// DB TABLES INSERT SCHEMAS
export const UserInsertSchema = createInsertSchema(UserTable)
export const AgencyInsertSchema = createInsertSchema(AgencyTable)
export const PermissionInsertSchema = createInsertSchema(PermissionTable)
export const SubAccountInsertSchema = createInsertSchema(SubAccountTable)
export const TagInsertSchema = createInsertSchema(TagTable)
export const PipelineInsertSchema = createInsertSchema(PipelineTable)
export const LaneInsertSchema = createInsertSchema(LaneTable)
export const TicketInsertSchema = createInsertSchema(TicketTable)
export const TagsToTicketsInsertSchema = createInsertSchema(TagsToTicketsTable)
export const TriggerInsertSchema = createInsertSchema(TriggerTable)
export const AutomationInsertSchema = createInsertSchema(AutomationTable)
export const AutomationInstanceInsertSchema = createInsertSchema(AutomationInstanceTable)
export const ActionInsertSchema = createInsertSchema(ActionTable)
export const ContactInsertSchema = createInsertSchema(ContactTable)
export const MediaInsertSchema = createInsertSchema(MediaTable)
export const FunnelInsertSchema = createInsertSchema(FunnelTable)
export const ClassNameInsertSchema = createInsertSchema(ClassNameTable)
export const FunnelPageInsertSchema = createInsertSchema(FunnelPageTable)
export const AgencySidebarOptionInsertSchema = createInsertSchema(AgencySidebarOptionTable)
export const SubAccountSidebarOptionInsertSchema = createInsertSchema(SubAccountSidebarOptionTable)
export const InvitationInsertSchema = createInsertSchema(InvitationTable)
export const NotificationInsertSchema = createInsertSchema(NotificationTable)
export const SubscriptionInsertSchema = createInsertSchema(SubscriptionTable)
export const AddOnInsertSchema = createInsertSchema(AddOnTable)
export const OAuthAccountInsertSchema = createInsertSchema(OAuthAccountTable)

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

// USER SCHEMA
export const UpdateUsernameSchema = z.object({
  name: z.string(),
})

export const UpdateAvatarSchema = z.object({
  avatarUrl: z.string().url(),
})

export const AddEmailSchema = z.object({
  email: z.string().email(),
})

export const DeleteOAuthAccountSchema = z.object({
  provider: z.enum(["google", "github"])
})

export const DeleteSessionSchema = z.object({
  sessionId: z.string(),
  current: z.boolean()
})

// AGENCY SCHEMA
export const UpsertAgencyProcedureSchema = AgencyInsertSchema.extend({
  price: SubscriptionSchema.pick({ price: true })
})

export const AgencyDetailsFormSchema = z.object({
  name: z.string().min(2, { message: "Agency name must be atleat 2 characters" }),
  companyEmail: z.string().email(),
  companyPhone: z.string(),
  whiteLabel: z.boolean().default(false),
  address: z.string().min(48),
  city: z.string().min(4),
  zipCode: z.string().min(4),
  state: z.string().min(4),
  country: z.string().min(4),
  agencyLogo: z.string().url()
})

export const UpdateAgencyGoalSchema = z.object({
  agencyId: z.string(),
  goal: z.number(),
})

export const DeleteAgencySchema = z.object({
  agencyId: z.string(),
})

export const InitUserProcedureSchema = UserSchema.partial()

// NOTIFICATION SCHEMAS
export const SaveActivityLogSchema = z.object({
  activity: z.string(),
  agencyId: z.string().optional(),
  subAccountId: z.string().optional()
})