import {
  text,
  datetime,
  varchar,
  mysqlTable,
  mysqlTableCreator,
  mysqlEnum,
  index,
  int,
  boolean,
  decimal,
  primaryKey,
  json,
  timestamp,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const createTable = mysqlTableCreator((name) => name);

export const IconEnum = mysqlEnum("icon", [
  "settings",
  "chart",
  "calendar",
  "check",
  "chip",
  "compass",
  "database",
  "flag",
  "home",
  "info",
  "link",
  "lock",
  "messages",
  "notification",
  "payment",
  "power",
  "receipt",
  "shield",
  "star",
  "tune",
  "videorecorder",
  "wallet",
  "warning",
  "headphone",
  "send",
  "pipelines",
  "person",
  "category",
  "contact",
  "clipboardIcon",
])

export const TriggerTypeEnum = mysqlEnum("type", ["CONTACT_FORM"])
export const ActionTypeEnum = mysqlEnum("type", ["CREATE_CONTACT"])
export const OAuthProviderEnum = mysqlEnum("provider", ["google", "github"])
export const InvitationStatusEnum = mysqlEnum("invitation_status", ["ACCEPTED", "REVOKED", "PENDING"])
export const PlanEnum = mysqlEnum("plan", ["price_1OYxkqFj9oKEERu1NbKUxXxN", "price_1OYxkqFj9oKEERu1KfJGWxgN"])
export const RoleEnum = mysqlEnum("role", ["AGENCY_OWNER", "AGENCY_ADMIN", "SUBACCOUNT_USER", "SUBACCOUNT_GUEST"])

export const UserTable = mysqlTable("user", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  name: varchar("name", { length: 256 }).notNull(),
  avatarUrl: text("avatar_url").notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }),
  role: RoleEnum.notNull().default("SUBACCOUNT_USER"),
  emailVerified: datetime("email_verified"),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  // FOREIGN KEY RELATIONS
  agencyId: varchar("agency_id", { length: 48 }).references(() => AgencyTable.id)
}, (table) => ({
  agencyIdIdx: index("agency_id_idx").on(table.agencyId)
}));

export const UserTableRelations = relations(UserTable, ({ one, many }) => ({
  agency: one(AgencyTable, {
    fields: [UserTable.agencyId],
    references: [AgencyTable.id]
  }),
  permissions: many(PermissionTable),
  tickets: many(TicketTable),
  notifications: many(NotificationTable),
}))

export const PermissionTable = mysqlTable("permission", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  access: boolean("access").notNull().default(false),
  // FOREIGN KEY RELATIONS
  email: varchar("email", { length: 256 }).notNull().references(() => UserTable.email),
  subAccountId: varchar("sub_account_id", { length: 48 }).notNull().references(() => SubAccountTable.id),
}, (table) => ({
  emailIdx: index("email_idx").on(table.email),
  subAccountIdIdx: index("sub_account_id_idx").on(table.subAccountId),
}))

export const PermissionTableRelations = relations(PermissionTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [PermissionTable.email],
    references: [UserTable.email]
  }),
  subAccount: one(SubAccountTable, {
    fields: [PermissionTable.subAccountId],
    references: [SubAccountTable.id]
  })
}))

export const AgencyTable = mysqlTable("agency", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  customerId: varchar("customer_id", { length: 48 }).notNull().default(""),
  connectAccountId: varchar("connect_account_id", { length: 48 }).default(""),
  name: varchar("name", { length: 256 }).notNull(),
  agencyLogo: varchar("agency_logo", { length: 128 }).notNull(),
  companyEmail: varchar("company_email", { length: 256 }).notNull(),
  companyPhone: varchar("company_phone", { length: 16 }).notNull(),
  whiteLabel: boolean("white_label").notNull().default(true),
  address: varchar("address", { length: 512 }).notNull(),
  city: varchar("address", { length: 128 }).notNull(),
  zipCode: varchar("address", { length: 16 }).notNull(),
  state: varchar("address", { length: 128 }).notNull(),
  country: varchar("address", { length: 64 }).notNull(),
  goal: int("goal").notNull().default(5),
})

export const AgencyTableRelations = relations(AgencyTable, ({ one, many }) => ({
  subscription: one(SubscriptionTable, {
    fields: [AgencyTable.id],
    references: [SubscriptionTable.agencyId]
  }),
  users: many(UserTable),
  addOns: many(AddOnTable),
  invitations: many(InvitationTable),
  subAccounts: many(SubAccountTable),
  notifications: many(NotificationTable),
  sidebarOptions: many(AgencySidebarOptionTable),
}))

export const SubAccountTable = mysqlTable("sub_account", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  connectAccountId: varchar("connect_account_id", { length: 48 }).default(""),
  name: varchar("name", { length: 256 }).notNull(),
  subAccountLogo: varchar("sub_account_logo", { length: 128 }).notNull(),
  companyEmail: varchar("company_email", { length: 256 }).notNull(),
  companyPhone: varchar("company_phone", { length: 16 }).notNull(),
  address: varchar("address", { length: 512 }).notNull(),
  city: varchar("address", { length: 128 }).notNull(),
  zipCode: varchar("address", { length: 16 }).notNull(),
  state: varchar("address", { length: 128 }).notNull(),
  country: varchar("address", { length: 64 }).notNull(),
  goal: int("goal").notNull().default(5),
  // FOREIGN KEY RELATIONS
  agencyId: varchar("agency_id", { length: 48 }).notNull().references(() => AgencyTable.id)
}, (table) => ({
  agencyIdIdx: index("agency_id_idx").on(table.agencyId)
}))

export const SubAccountTableRelations = relations(SubAccountTable, ({ one, many }) => ({
  agency: one(AgencyTable, {
    fields: [SubAccountTable.agencyId],
    references: [AgencyTable.id]
  }),
  tags: many(TagTable),
  media: many(MediaTable),
  funnels: many(FunnelTable),
  contacts: many(ContactTable),
  triggers: many(TriggerTable),
  pipelines: many(PipelineTable),
  permissions: many(PermissionTable),
  automations: many(AutomationTable),
  notifications: many(NotificationTable),
  sidebarOptions: many(SubAccountSidebarOptionTable),
}))

export const TagTable = mysqlTable("tag", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  name: varchar("name", { length: 256 }).notNull(),
  color: varchar("color", { length: 32 }).notNull(),
  // FOREIGN KEY RELATIONS
  subAccountId: varchar("sub_account_id", { length: 48 }).notNull().references(() => SubAccountTable.id)
}, (table) => ({
  subAccountIdIdx: index("sub_account_id_idx").on(table.subAccountId)
}))

export const TagTableRelations = relations(TagTable, ({ one, many }) => ({
  subAccount: one(SubAccountTable, {
    fields: [TagTable.subAccountId],
    references: [SubAccountTable.id]
  }),
  tickets: many(TagsToTicketsTable),
}))

export const PipelineTable = mysqlTable("pipeline", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  name: varchar("name", { length: 256 }).notNull(),
  // FOREIGN KEY RELATIONS
  subAccountId: varchar("sub_account_id", { length: 48 }).notNull().references(() => SubAccountTable.id)
}, (table) => ({
  subAccountIdIdx: index("sub_account_id_idx").on(table.subAccountId)
}))

export const PipelineTableRelations = relations(PipelineTable, ({ one, many }) => ({
  subAccount: one(SubAccountTable, {
    fields: [PipelineTable.subAccountId],
    references: [SubAccountTable.id]
  }),
  lanes: many(LaneTable)
}))

export const LaneTable = mysqlTable("lane", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  name: varchar("name", { length: 256 }).notNull(),
  order: int("order").notNull().default(0),
  // FOREIGN KEY RELATIONS
  pipelineId: varchar("pipeline_id", { length: 48 }).notNull().references(() => PipelineTable.id)
}, (table) => ({
  pipelineIdIdx: index("pipeline_id_idx").on(table.pipelineId)
}))

export const LaneTableRelations = relations(LaneTable, ({ one, many }) => ({
  pipeline: one(PipelineTable, {
    fields: [LaneTable.pipelineId],
    references: [PipelineTable.id]
  }),
  tickets: many(TicketTable)
}))

export const TicketTable = mysqlTable("ticket", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  name: varchar("name", { length: 256 }).notNull(),
  order: int("order").notNull().default(0),
  value: decimal("value"),
  description: varchar("description", { length: 512 }),
  // FOREIGN KEY RELATIONS
  laneId: varchar("lane_id", { length: 48 }).notNull().references(() => LaneTable.id),
  customerId: varchar("customer_id", { length: 48 }).references(() => ContactTable.id),
  assignedUserId: varchar("assigned_user_id", { length: 48 }).references(() => UserTable.id),
}, (table) => ({
  laneIdIdx: index("lane_id_idx").on(table.laneId),
  customerIdIdx: index("customer_id_idx").on(table.customerId),
  assignedUserIdIdx: index("assigned_user_id_idx").on(table.assignedUserId),
}))

export const TicketTableRelations = relations(TicketTable, ({ one, many }) => ({
  lane: one(LaneTable, {
    fields: [TicketTable.laneId],
    references: [LaneTable.id]
  }),
  assigned: one(UserTable, {
    fields: [TicketTable.assignedUserId],
    references: [UserTable.id]
  }),
  tags: many(TagsToTicketsTable),
  contact: one(ContactTable, {
    fields: [TicketTable.customerId],
    references: [ContactTable.id]
  })
}))

export const TagsToTicketsTable = mysqlTable("tags_to_tickets", {
  tagId: varchar("tag_id", { length: 48 }).notNull().references(() => TagTable.id),
  ticketId: varchar("ticket_id", { length: 48 }).notNull().references(() => TicketTable.id)
}, (table) => ({
  pk: primaryKey({ columns: [table.tagId, table.ticketId] })
}))

export const TagsToTicketsTableRelations = relations(TagsToTicketsTable, ({ one }) => ({
  tag: one(TagTable, {
    fields: [TagsToTicketsTable.tagId],
    references: [TagTable.id],
  }),
  ticket: one(TicketTable, {
    fields: [TagsToTicketsTable.tagId],
    references: [TicketTable.id],
  })
}))

export const TriggerTable = mysqlTable("trigger", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  name: varchar("name", { length: 256 }).notNull(),
  type: TriggerTypeEnum.notNull(),
  // FOREIGN KEY RELATIONS
  subAccountId: varchar("sub_account_id", { length: 48 }).notNull().references(() => SubAccountTable.id),
}, (table) => ({
  subAccountIdIdx: index("sub_account_id_idx").on(table.subAccountId)
}))

export const TriggerTableRelations = relations(TriggerTable, ({ one, many }) => ({
  subAccount: one(SubAccountTable, {
    fields: [TriggerTable.subAccountId],
    references: [SubAccountTable.id]
  }),
  automations: many(AutomationTable)
}))

export const AutomationTable = mysqlTable("automation", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  name: varchar("name", { length: 256 }).notNull(),
  published: boolean("published").notNull().default(false),
  // FOREIGN KEY RELATION
  triggerId: varchar("trigger_id", { length: 48 }).references(() => TriggerTable.id),
  subAccountId: varchar("sub_account_id", { length: 48 }).notNull().references(() => SubAccountTable.id),
}, (table) => ({
  triggerIdIdx: index("trigger_id_idx").on(table.triggerId),
  subAccountIdIdx: index("sub_account_id_idx").on(table.subAccountId)
}))

export const AutomationTableRelations = relations(AutomationTable, ({ one, many }) => ({
  trigger: one(TriggerTable, {
    fields: [AutomationTable.triggerId],
    references: [TriggerTable.id]
  }),
  subAccount: one(SubAccountTable, {
    fields: [AutomationTable.subAccountId],
    references: [SubAccountTable.id],
  }),
  actions: many(ActionTable),
  automationInstances: many(AutomationInstanceTable)
}))

export const AutomationInstanceTable = mysqlTable("automation_instance", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  active: boolean("active").notNull().default(false),
  // FOREIGN KEY RELATIONS
  automationId: varchar("automation_id", { length: 48 }).notNull().references(() => AutomationTable.id),
}, (table) => ({
  automationIdIdx: index("automation_id_idx").on(table.automationId),
}))

export const AutomationInstanceTableRelations = relations(AutomationInstanceTable, ({ one }) => ({
  automation: one(AutomationTable, {
    fields: [AutomationInstanceTable.automationId],
    references: [AutomationTable.id]
  })
}))

export const ActionTable = mysqlTable("action", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  name: varchar("name", { length: 256 }).notNull(),
  type: ActionTypeEnum.notNull(),
  order: int("order").notNull(),
  laneId: varchar("lane_id", { length: 48 }).notNull().default(""),
  // FOREIGN KEY RELATIONS
  automationId: varchar("automation_id", { length: 48 }).notNull().references(() => AutomationTable.id),
}, (table) => ({
  automationIdIdx: index("automation_id_idx").on(table.automationId)
}))

export const ActionTableRelations = relations(ActionTable, ({ one }) => ({
  automation: one(AutomationTable, {
    fields: [ActionTable.automationId],
    references: [AutomationTable.id],
  })
}))

export const ContactTable = mysqlTable("contact", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  // FOREIGN KEY RELATIONS
  subAccountId: varchar("sub_account_id", { length: 48 }).notNull().references(() => SubAccountTable.id)
}, (table) => ({
  subAccountIdIdx: index("sub_account_id_idx").on(table.subAccountId)
}))

export const ContactTableRelations = relations(ContactTable, ({ one, many }) => ({
  subAccount: one(SubAccountTable, {
    fields: [ContactTable.subAccountId],
    references: [SubAccountTable.id]
  }),
  tickets: many(TicketTable)
}))

export const MediaTable = mysqlTable("media", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  name: varchar("name", { length: 256 }).notNull(),
  type: varchar("type", { length: 128 }),
  link: varchar("link", { length: 1024 }).notNull(),
  // FOREIGN KEY RELATIONS
  subAccountId: varchar("sub_account_id", { length: 48 }).notNull().references(() => SubAccountTable.id)
}, (table) => ({
  subAccountIdIdx: index("sub_account_id_idx").on(table.subAccountId),
}))

export const MediaTableRelations = relations(MediaTable, ({ one }) => ({
  subAccount: one(SubAccountTable, {
    fields: [MediaTable.subAccountId],
    references: [SubAccountTable.id]
  })
}))

export const FunnelTable = mysqlTable("funnel", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 512 }),
  published: boolean("published").notNull().default(false),
  subDomainName: varchar("sub_domain_name", { length: 256 }),
  favicon: varchar("favicon", { length: 256 }),
  liveProducts: json("live_products").$type<string[]>().notNull().default([]),
  // FOREIGN KEY RELATIONS
  subAccountId: varchar("sub_account_id", { length: 48 }).notNull().references(() => SubAccountTable.id)
}, (table) => ({
  subAccountIdIdx: index("sub_account_id_idx").on(table.subAccountId)
}))

export const FunnelTableRelations = relations(FunnelTable, ({ one, many }) => ({
  subAccount: one(SubAccountTable, {
    fields: [FunnelTable.subAccountId],
    references: [SubAccountTable.id]
  }),
  classNames: many(ClassNameTable),
  funnelPages: many(FunnelPageTable),
}))

export const ClassNameTable = mysqlTable("class_name", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  name: varchar("name", { length: 256 }).notNull(),
  color: varchar("color", { length: 32 }).notNull(),
  customData: text("custom_data"),
  // FOREIGN KEY RELATIONS
  funnelId: varchar("funnel_id", { length: 48 }).notNull().references(() => FunnelTable.id)
}, (table) => ({
  funnelIdIdx: index("funnel_id_idx").on(table.funnelId)
}))

export const ClassNameTableRelations = relations(ClassNameTable, ({ one }) => ({
  funnel: one(FunnelTable, {
    fields: [ClassNameTable.funnelId],
    references: [FunnelTable.id]
  })
}))

export const FunnelPageTable = mysqlTable("funnel_page", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  name: varchar("name", { length: 256 }).notNull(),
  pathName: varchar("path_name", { length: 256 }).notNull().default(""),
  visits: int("visits").notNull().default(0),
  content: text("content"),
  order: int("order"),
  previewImage: text("preview_image"),
  // FOREIGN KEY RELATIONS
  funnelId: varchar("funnel_id", { length: 48 }).notNull().references(() => FunnelTable.id)
}, (table) => ({
  funnelIdIdx: index("funnel_id_idx").on(table.funnelId)
}))

export const FunnelPageTableRelations = relations(FunnelPageTable, ({ one }) => ({
  funnel: one(FunnelTable, {
    fields: [FunnelPageTable.funnelId],
    references: [FunnelTable.id]
  })
}))

export const AgencySidebarOptionTable = mysqlTable("agency_sidebar_option", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  name: varchar("name", { length: 256 }).notNull(),
  link: text("link").notNull().default("#"),
  icon: IconEnum.notNull().default("info"),
  // FOREIGN KEY RELATIONS
  agencyId: varchar("agency_id", { length: 48 }).references(() => AgencyTable.id)
}, (table) => ({
  agencyIdIdx: index("agency_id_idx").on(table.agencyId)
}))

export const AgencySidebarOptionTableRelations = relations(AgencySidebarOptionTable, ({ one }) => ({
  agency: one(AgencyTable, {
    fields: [AgencySidebarOptionTable.agencyId],
    references: [AgencyTable.id]
  })
}))

export const SubAccountSidebarOptionTable = mysqlTable("sub_account_sidebar_option", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  name: varchar("name", { length: 256 }).notNull(),
  link: text("link").notNull().default("#"),
  icon: IconEnum.notNull().default("info"),
  // FOREIGN KEY RELATIONS
  subAccountId: varchar("sub_account_id", { length: 48 }).references(() => AgencyTable.id)
}, (table) => ({
  subAccountIdIdx: index("sub_account_id_idx").on(table.subAccountId)
}))

export const SubAccountSidebarOptionTableRelations = relations(SubAccountSidebarOptionTable, ({ one }) => ({
  subAccount: one(SubAccountTable, {
    fields: [SubAccountSidebarOptionTable.subAccountId],
    references: [SubAccountTable.id]
  })
}))

export const InvitationTable = mysqlTable("invitation", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  email: varchar("email", { length: 256 }).unique(),
  status: InvitationStatusEnum.notNull().default("PENDING"),
  role: RoleEnum.notNull().default("SUBACCOUNT_USER"),
  // FOREIGN KEY RELATIONS
  agencyId: varchar("agency_id", { length: 48 }).references(() => AgencyTable.id)
}, (table) => ({
  agencyIdIdx: index("agency_id_idx").on(table.agencyId)
}))

export const InvitationTableRelations = relations(InvitationTable, ({ one }) => ({
  agency: one(AgencyTable, {
    fields: [InvitationTable.agencyId],
    references: [AgencyTable.id]
  })
}))

export const NotificationTable = mysqlTable("notification", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  text: text("text").notNull(),
  // FOREIGN KEY RELATIONS
  userId: varchar("user_id", { length: 48 }).notNull().references(() => UserTable.id),
  agencyId: varchar("agency_id", { length: 48 }).notNull().references(() => AgencyTable.id),
  subAccountId: varchar("sub_account_id", { length: 48 }).references(() => SubAccountTable.id),
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
  agencyIdIdx: index("agency_id_idx").on(table.agencyId),
  subAccountIdIdx: index("sub_account_id_idx").on(table.subAccountId),
}))

export const NotificationTableRelations = relations(NotificationTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [NotificationTable.userId],
    references: [UserTable.id],
  }),
  agency: one(AgencyTable, {
    fields: [NotificationTable.userId],
    references: [AgencyTable.id],
  }),
  subAccount: one(SubAccountTable, {
    fields: [NotificationTable.userId],
    references: [SubAccountTable.id],
  }),
}))

export const SubscriptionTable = mysqlTable("subscription", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  plan: PlanEnum,
  price: varchar("price", { length: 8 }),
  active: boolean("active").notNull().default(false),
  priceId: varchar("price_id", { length: 48 }).notNull(),
  customerId: varchar("customer_id", { length: 48 }).notNull(),
  subscriptionId: varchar("subscription_id", { length: 48 }).notNull().unique(),
  currentPeriodEndDate: datetime("current_period_end_date"),
  // FOREIGN KEY RELATIONS
  agencyId: varchar("agency_id", { length: 48 }).references(() => AgencyTable.id),
}, (table) => ({
  agencyIdIdx: index("agency_id_idx").on(table.agencyId),
  customerIdIdx: index("customer_id_idx").on(table.customerId),
}))

export const SubscriptionTableRelations = relations(SubscriptionTable, ({ one }) => ({
  agency: one(AgencyTable, {
    fields: [SubscriptionTable.agencyId],
    references: [AgencyTable.id],
  }),
}))

export const AddOnTable = mysqlTable("add_on", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
  name: varchar("name", { length: 256 }).notNull(),
  active: boolean("active").notNull().default(false),
  priceId: varchar("price_id", { length: 48 }).notNull().unique(),
  // FOREIGN KEY RELATIONS
  agencyId: varchar("agency_id", { length: 48 }).references(() => AgencyTable.id),
}, (table) => ({
  agencyIdIdx: index("agency_id_idx").on(table.agencyId),
}))

export const AddOnTableRelations = relations(AddOnTable, ({ one }) => ({
  agency: one(AgencyTable, {
    fields: [AddOnTable.agencyId],
    references: [AgencyTable.id],
  }),
}))

export const OAuthAccountTable = mysqlTable("oauth_account", {
  id: varchar("id", { length: 48 }).$defaultFn(() => createId()).primaryKey(),
  provider: OAuthProviderEnum.notNull(),
  providerUserId: varchar("provider_user_id", { length: 64 }).notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  // FOREIGN KEY RELATIONS
  userId: varchar("user_id", { length: 48 }).notNull().references(() => UserTable.id),
})

export const SessionTable = mysqlTable("session", {
  id: varchar("id", {
    length: 48,
  }).primaryKey(),
  expiresAt: datetime("expires_at").notNull(),
  browser: varchar("browser", { length: 32 }).notNull().default(""),
  os: varchar("os", { length: 32 }).notNull().default(""),
  ip: varchar("ip", { length: 32 }).notNull().default(""),
  // FOREIGN KEY RELATIONS
  userId: varchar("user_id", {
    length: 24,
  })
    .notNull()
    .references(() => UserTable.id),
});