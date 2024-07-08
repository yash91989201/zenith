// TYPES
import type z from "zod"
import type { Session } from "lucia"
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
  TagsToTicketsSchema,
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
} from "@lib/schema"

// DB TABLE TYPES
export type UserType = Omit<z.infer<typeof UserSchema>, "password">
export type PermissionType = z.infer<typeof PermissionSchema>
export type AgencyType = z.infer<typeof AgencySchema>
export type SubAccountType = z.infer<typeof SubAccountSchema>
export type TagType = z.infer<typeof TagSchema>
export type PipelineType = z.infer<typeof PipelineSchema>
export type LaneType = z.infer<typeof LaneSchema>
export type TicketType = z.infer<typeof TicketSchema>
export type TagsToTicketsType = z.infer<typeof TagsToTicketsSchema>
export type TriggerType = z.infer<typeof TriggerSchema>
export type AutomationType = z.infer<typeof AutomationSchema>
export type AutomationInstanceType = z.infer<typeof AutomationInstanceSchema>
export type ActionType = z.infer<typeof ActionSchema>
export type ContactType = z.infer<typeof ContactSchema>
export type MediaType = z.infer<typeof MediaSchema>
export type FunnelType = z.infer<typeof FunnelSchema>
export type ClassNameType = z.infer<typeof ClassNameSchema>
export type FunnelPageType = z.infer<typeof FunnelPageSchema>
export type AgencySidebarOptionType = z.infer<typeof AgencySidebarOptionSchema>
export type SubAccountSidebarOptionType = z.infer<typeof SubAccountSidebarOptionSchema>
export type InvitationType = z.infer<typeof InvitationSchema>
export type NotificationType = z.infer<typeof NotificationSchema>
export type SubscriptionType = z.infer<typeof SubscriptionSchema>
export type AddOnType = z.infer<typeof AddOnSchema>

// DB TABLE INSERT TYPES
export type UserInsertType = Omit<z.infer<typeof UserInsertSchema>, "password">

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

