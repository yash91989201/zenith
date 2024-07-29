// DB TABLE SCHEMAS
import type {
  UserSchema,
  PermissionSchema,
  AgencySchema,
  SubAccountSchema,
  TagSchema,
  PipelineSchema,
  LaneSchema,
  TicketSchema,
  TicketsToTagsSchema,
  TriggerSchema,
  AutomationSchema,
  AutomationInstanceSchema,
  ActionSchema,
  ContactSchema,
  MediaSchema,
  FunnelSchema,
  ClassNameSchema,
  FunnelPageSchema,
  AgencySidebarOptionSchema,
  SubAccountSidebarOptionSchema,
  InvitationSchema,
  NotificationSchema,
  SubscriptionSchema,
  AddOnSchema,
  CredsSignInSchema,
  CredsSignUpSchema,
  UserInsertSchema,
  UpdateUsernameSchema,
  UpdateAvatarSchema,
  AddEmailSchema,
  DeleteSessionSchema,
  DeleteOAuthAccountSchema,
  OAuthAccountSchema,
  UpsertAgencySchema,
  UpdateAgencyGoalSchema,
  SaveActivityLogSchema,
  DeleteAgencySchema,
  InitUserProcedureSchema,
  UpsertAgencyProcedureSchema,
  PermissionInsertSchema,
  AgencyInsertSchema,
  SubAccountInsertSchema,
  TagInsertSchema,
  PipelineInsertSchema,
  LaneInsertSchema,
  TicketInsertSchema,
  TagsToTicketsInsertSchema,
  TriggerInsertSchema,
  AutomationInsertSchema,
  AutomationInstanceInsertSchema,
  ActionInsertSchema,
  ContactInsertSchema,
  MediaInsertSchema,
  FunnelInsertSchema,
  ClassNameInsertSchema,
  FunnelPageInsertSchema,
  AgencySidebarOptionInsertSchema,
  SubAccountSidebarOptionInsertSchema,
  InvitationInsertSchema,
  NotificationInsertSchema,
  SubscriptionInsertSchema,
  AddOnInsertSchema,
  OAuthAccountInsertSchema,
  UpsertSubAccountSchema,
  UpsertSubaccountProcedureSchema,
  MarkNotificationsReadSchema,
  UpdateUserDetailsSchema,
  UpsertSubAccountPermissionSchema,
  UpdateUserByIdSchema,
  DeleteSubAccountByIdSchema,
  DeleteUserSchema,
  InviteUserSchema,
  SaveMediaDataSchema,
  UpsertFunnelSchema,
  UpsertPipelineFormSchema,
  DeletePipelineByIdSchema,
  UpdateLaneOrderSchema,
  UpdateTicketOrderSchema,
  DeleteLaneSchema,
  GetTicketsWithTagsSchema,
  TicketFormSchema,
  UpsertTicketSchema,
  TagByIdSchema,
  ChangeLanePipelineSchema,
  ChangeTicketLaneSchema,
  CreateContactSchema,
  UpdateFunnelProductsSchema,
  UpsertFunnelPageSchema,
  DeleteFunnelPageSchema,
} from "@lib/schema"
// TYPES
import type z from "zod"
import type Stripe from "stripe"
import type { Session } from "lucia"
import type { AddressParam, } from "@stripe/stripe-js"

// DB TABLE TYPES
export type UserType = Omit<z.infer<typeof UserSchema>, "password">
export type PermissionType = z.infer<typeof PermissionSchema>
export type AgencyType = z.infer<typeof AgencySchema>
export type SubAccountType = z.infer<typeof SubAccountSchema>
export type TagType = z.infer<typeof TagSchema>
export type PipelineType = z.infer<typeof PipelineSchema>
export type LaneType = z.infer<typeof LaneSchema>
export type TicketType = z.infer<typeof TicketSchema>
export type TicketsToTagsType = z.infer<typeof TicketsToTagsSchema>
export type TriggerType = z.infer<typeof TriggerSchema>
export type AutomationType = z.infer<typeof AutomationSchema>
export type AutomationInstanceType = z.infer<typeof AutomationInstanceSchema>
export type ActionType = z.infer<typeof ActionSchema>
export type ContactType = z.infer<typeof ContactSchema>
export type MediaType = z.infer<typeof MediaSchema>
export type FunnelType = Omit<z.infer<typeof FunnelSchema>, "liveProducts"> & { liveProducts: { productId: string; recurring: boolean }[] }
export type ClassNameType = z.infer<typeof ClassNameSchema>
export type FunnelPageType = z.infer<typeof FunnelPageSchema>
export type AgencySidebarOptionType = z.infer<typeof AgencySidebarOptionSchema>
export type SubAccountSidebarOptionType = z.infer<typeof SubAccountSidebarOptionSchema>
export type InvitationType = z.infer<typeof InvitationSchema>
export type NotificationType = z.infer<typeof NotificationSchema>
export type SubscriptionType = z.infer<typeof SubscriptionSchema>
export type AddOnType = z.infer<typeof AddOnSchema>
export type OAuthAccountType = z.infer<typeof OAuthAccountSchema>

// DB TABLE INSERT TYPES
export type UserInsertType = z.infer<typeof UserInsertSchema>
export type PermissionInsertType = z.infer<typeof PermissionInsertSchema>
export type AgencyInsertType = z.infer<typeof AgencyInsertSchema>
export type SubAccountInsertType = z.infer<typeof SubAccountInsertSchema>
export type TagInsertType = z.infer<typeof TagInsertSchema>
export type PipelineInsertType = z.infer<typeof PipelineInsertSchema>
export type LaneInsertType = z.infer<typeof LaneInsertSchema>
export type TicketInsertType = z.infer<typeof TicketInsertSchema>
export type TagsToTicketsInsertType = z.infer<typeof TagsToTicketsInsertSchema>
export type TriggerInsertType = z.infer<typeof TriggerInsertSchema>
export type AutomationInsertType = z.infer<typeof AutomationInsertSchema>
export type AutomationInstanceInsertType = z.infer<typeof AutomationInstanceInsertSchema>
export type ActionInsertType = z.infer<typeof ActionInsertSchema>
export type ContactInsertType = z.infer<typeof ContactInsertSchema>
export type MediaInsertType = z.infer<typeof MediaInsertSchema>
export type FunnelInsertType = Omit<z.infer<typeof FunnelInsertSchema>, "liveProducts"> & { liveProducts: { productId: string; recurring: boolean }[] | undefined }
export type ClassNameInsertType = z.infer<typeof ClassNameInsertSchema>
export type FunnelPageInsertType = z.infer<typeof FunnelPageInsertSchema>
export type AgencySidebarOptionInsertType = z.infer<typeof AgencySidebarOptionInsertSchema>
export type SubAccountSidebarOptionInsertType = z.infer<typeof SubAccountSidebarOptionInsertSchema>
export type InvitationInsertType = z.infer<typeof InvitationInsertSchema>
export type NotificationInsertType = z.infer<typeof NotificationInsertSchema>
export type SubscriptionInsertType = z.infer<typeof SubscriptionInsertSchema>
export type AddOnInsertType = z.infer<typeof AddOnInsertSchema>
export type OAuthAccountInsertType = z.infer<typeof OAuthAccountInsertSchema>

// AUTH TYPES
export type CredsSignInType = z.infer<typeof CredsSignInSchema>
export type CredsSignUpType = z.infer<typeof CredsSignUpSchema>

export type UserSessionType =
  | {
    user: UserType;
    session: Session;
  }
  | {
    user: null;
    session: null;
  };

// USER TYPE
export type UpdateUsernameType = z.infer<typeof UpdateUsernameSchema>
export type UpdateAvatarType = z.infer<typeof UpdateAvatarSchema>
export type AddEmailType = z.infer<typeof AddEmailSchema>
export type DeleteOAuthAccountType = z.infer<typeof DeleteOAuthAccountSchema>
export type DeleteSessionType = z.infer<typeof DeleteSessionSchema>
export type UpdateUserDetailsType = z.infer<typeof UpdateUserDetailsSchema>
export type UpdateUserByIdType = z.infer<typeof UpdateUserByIdSchema>
export type InviteUserType = z.infer<typeof InviteUserSchema>
export type DeleteUserType = z.infer<typeof DeleteUserSchema>

// agency form schema types
export type UpsetAgencyProcedureType = z.infer<typeof UpsertAgencyProcedureSchema>
export type UpsertAgencyType = z.infer<typeof UpsertAgencySchema>
export type UpdateAgencyGoalType = z.infer<typeof UpdateAgencyGoalSchema>
export type DeleteAgencyType = z.infer<typeof DeleteAgencySchema>
export type InitUserProcedureType = z.infer<typeof InitUserProcedureSchema>

// SUBACCOUNT SCHEMA TYPES
export type UpsertSubAccountType = z.infer<typeof UpsertSubAccountSchema>
export type UpsertSubaccountProcedureType = z.infer<typeof UpsertSubaccountProcedureSchema>
export type UpsertSubAccountPermissionType = z.infer<typeof UpsertSubAccountPermissionSchema>
export type DeleteSubAccountByIdType = z.infer<typeof DeleteSubAccountByIdSchema>

// MEDIA SCHEMA TYPES
export type SaveMediaDataType = z.infer<typeof SaveMediaDataSchema>

// notification
export type SaveAvtivityLogType = z.infer<typeof SaveActivityLogSchema>
export type MarkNotificationsReadType = z.infer<typeof MarkNotificationsReadSchema>

// PIPELINE SCHEMA TYPES
export type UpsertPipelineFormType = z.infer<typeof UpsertPipelineFormSchema>
export type DeletePipelineByIdType = z.infer<typeof DeletePipelineByIdSchema>

// LANE SCHEMA TYPES
export type UpdateLaneOrderType = z.infer<typeof UpdateLaneOrderSchema>
export type DeleteLaneType = z.infer<typeof DeleteLaneSchema>
export type ChangeLanePipelineType = z.infer<typeof ChangeLanePipelineSchema>

// TICKET SCHEMA TYPES
export type UpdateTicketOrdertype = z.infer<typeof UpdateTicketOrderSchema>
export type GetTicketsWithTagsType = z.infer<typeof GetTicketsWithTagsSchema>
export type TicketFormType = z.infer<typeof TicketFormSchema>
export type UpsertTicketType = z.infer<typeof UpsertTicketSchema>
export type ChangeTicketLaneType = z.infer<typeof ChangeTicketLaneSchema>

// TAG SCHEMA TYPES
export type TagByIdType = z.infer<typeof TagByIdSchema>

// FUNNEL SCHEMA TYPES
export type UpsertFunnelType = z.infer<typeof UpsertFunnelSchema>
export type UpdateFunnelProductsType = z.infer<typeof UpdateFunnelProductsSchema>
export type DeleteFunnelPageType = z.infer<typeof DeleteFunnelPageSchema>

// FUNNEL PAGE SCHEMA TYPES
export type UpsertFunnelPageType = z.infer<typeof UpsertFunnelPageSchema>

// CONTACT SCHEMA TYPES
export type CreateContactType = z.infer<typeof CreateContactSchema>

// CUSTOM TYPES
export type TicketAndTagsType = TicketType & {
  tags: TagType[];
  assigned: UserType | null;
  customer: ContactType | null
}

export type LaneDetailType = LaneType & {
  tickets: TicketAndTagsType[]
}

export type TicketDetail = TicketType & {
  assigned: UserType;
  customer: ContactType;
  lane: LaneType;
  tags: TagType[]
}

export type SubAccountContactsType = SubAccountType & {
  contact: (ContactType & {
    ticket: TicketType[]
  })[]
}

export type FunnelWithPagesType = FunnelType & {
  funnelPages: FunnelPageType[]
}

const TagColors = ['BLUE', 'ORANGE', 'ROSE', 'PURPLE', 'GREEN'] as const
export type TagColor = (typeof TagColors)[number]

// TABLE TYPES
export type TeamTableType = UserType & {
  agency: AgencyType & {
    subAccounts: SubAccountType[]
  } | null;
  permissions: (PermissionType & {
    subAccount: SubAccountType | null
  })[];
}

// OAUTH USER TYPES
export type GoogleUserType = {
  id: string,
  email: string,
  verified_email: string,
  name: string,
  picture: string,
  locale: string
}

export type GithubUserType = {
  id: string,
  name: string,
  // username 
  login: string,
  avatar_url: string,
  locale: string
}

export type GithubUserEmailType = {
  email: string,
  primary: boolean,
  verified: boolean
}[]

export type GoogleAuthUrlResType = Promise<
  { status: "failed", error: string, authorizationUrl: null } |
  { status: "success", error: null, authorizationUrl: string }
>

export type GithubAuthUrlResType = Promise<
  { status: "failed", error: string, authorizationUrl: null } |
  { status: "success", error: null, authorizationUrl: string }
>

export type CreateGoogleOAuthUserResponseType = Promise<
  { status: "failed", error: string, data: null } |
  { status: "success", error: null, data: Omit<UserInsertType, "id"> & { id: string } }
>

export type CreateGithubOAuthUserResponseType = Promise<
  { status: "failed", error: string, data: null } |
  { status: "success", error: null, data: Omit<UserInsertType, "id"> & { id: string } }
>

// S3 BUCKETS
export type S3_BUCKETS = "profile" | "media"
export type STORE_ENDPOINTS = "/api/file/agency-logo" | "/api/file/profile" | "/api/file/media"

// STRIPE TYPE
export type StripeCustomerType = {
  email: string;
  name: string;
  shipping: Stripe.CustomerCreateParams.Shipping;
  address: AddressParam
}

export type PriceList = Stripe.ApiList<Stripe.Price>