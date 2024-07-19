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
  TicketsToTagsTable,
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
import { CURRENCY_NUMBER_REGEX } from "@/lib/utils"

// DB TABLES SCHEMAS
export const UserSchema = createSelectSchema(UserTable)
export const PermissionSchema = createSelectSchema(PermissionTable)
export const AgencySchema = createSelectSchema(AgencyTable)
export const SubAccountSchema = createSelectSchema(SubAccountTable)
export const TagSchema = createSelectSchema(TagTable)
export const PipelineSchema = createSelectSchema(PipelineTable)
export const LaneSchema = createSelectSchema(LaneTable)
export const TicketSchema = createSelectSchema(TicketTable)
export const TicketsToTagsSchema = createSelectSchema(TicketsToTagsTable)
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
export const TagsToTicketsInsertSchema = createInsertSchema(TicketsToTagsTable)
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

export const GetUserDetailsSchema = z.object({
  id: z.string().optional(),
})

export const GetUserNotificationsSchema = z.object({
  agencyId: z.string(),
  subAccountId: z.string().optional()
})

export const GetAgencyAndPermissionsSchema = z.object({
  agencyId: z.string()
})

export const UpdateUserByIdSchema = UserSchema.pick({
  id: true,
  name: true,
  role: true,
  avatarUrl: true,
})

export const UpdateUserDetailsSchema = UserSchema.pick({
  name: true,
  email: true,
  avatarUrl: true,
  role: true
})

export const InviteUserSchema = z.object({
  agencyId: z.string(),
  name: z.string().min(6, { message: "Full name is required" }),
  email: z.string().email(),
  role: z.enum(["AGENCY_ADMIN", "SUBACCOUNT_USER", "SUBACCOUNT_GUEST"]),
})

export const DeleteUserSchema = z.object({
  userId: z.string(),
})

// AGENCY SCHEMA
export const GetAgencyById = z.object({
  agencyId: z.string()
})

export const UpsertAgencyProcedureSchema = AgencyInsertSchema.extend({
  price: SubscriptionSchema.pick({ price: true })
})

export const UpsertAgencySchema = z.object({
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

// SUBACCOUNT SCHEMAS
export const GetSubAccountByIdSchema = z.object({
  id: z.string()
})
export const DeleteSubAccountByIdSchema = z.object({
  id: z.string()
})

export const UpsertSubAccountSchema = z.object({
  name: z.string(),
  companyEmail: z.string(),
  companyPhone: z.string().min(1),
  address: z.string(),
  city: z.string(),
  subAccountLogo: z.string().url(),
  zipCode: z.string(),
  state: z.string(),
  country: z.string(),
})

export const UpsertSubaccountProcedureSchema = SubAccountInsertSchema
export const UpsertSubAccountPermissionSchema = z.object({
  access: z.boolean(),
  subAccountId: z.string(),
  email: z.string().email(),
  permissionId: z.string().optional(),
})

// MEDIA SCHEMA
export const GetSubAccountMediaSchema = z.object({
  subAccountId: z.string()
})

export const SaveMediaDataSchema = z.object({
  name: z.string(),
  type: z.string(),
  link: z.string().url(),
  subAccountId: z.string()
})

// PIPELINE SCHEMAS
export const GetPipelineByIdSchema = z.object({
  id: z.string()
})

export const GetPipelineBySubAccountIdSchema = z.object({
  subAccountId: z.string()
})

export const UpsertPipelineFormSchema = z.object({
  name: z.string()
})

export const DeletePipelineByIdSchema = z.object({
  id: z.string()
})

// LANE SCHEMAS
export const GetLaneDetailSchema = z.object({
  pipelineId: z.string()
})

export const UpdateLaneOrderSchema = z.object({
  lanes: z.array(LaneSchema)
})

export const DeleteLaneSchema = z.object({
  laneId: z.string()
})

// TICKET SCHEMAS
export const GetTicketsWithTagsSchema = z.object({
  pipelineId: z.string()
})

export const UpdateTicketOrderSchema = z.object({
  tickets: z.array(TicketSchema)
})

export const TicketFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  value: z.string().refine(value => CURRENCY_NUMBER_REGEX.test(value), {
    message: "Value must be valid price"
  })
})

export const UpsertTicketSchema = z.object({
  ticket: TicketInsertSchema,
  tags: z.array(TagSchema)
})

// TAGS SCHEMA
export const GetAllTagsSchema = z.object({
  subAccountId: z.string()
})

export const TagByIdSchema = z.object({
  tagId: z.string()
})

// FUNNEL SCHEMAS
export const CreateFunnelFormSchema = z.object({
  name: z.string(),
  description: z.string(),
  subDomainName: z.string().optional(),
  favicon: z.string().optional(),
})

export const CreateFunnelProcedureSchema = z.object({
  subAccountId: z.string(),
  funnel: CreateFunnelFormSchema.extend({
    liveProduces: z.string()
  }),
  funnelId: z.string(),
})

// CONTACT SCHEMA
export const GetContactByNameSchema = z.object({
  name: z.string().min(1)
})

// NOTIFICATION SCHEMAS
export const SaveActivityLogSchema = z.object({
  activity: z.string(),
  agencyId: z.string().optional(),
  subAccountId: z.string().optional()
})

export const MarkNotificationsReadSchema = z.object({
  notificationIds: z.array(z.string())
})