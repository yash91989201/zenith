CREATE TABLE `action` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`name` varchar(256) NOT NULL,
	`type` enum('CREATE_CONTACT') NOT NULL,
	`order` int NOT NULL,
	`lane_id` varchar(48) NOT NULL DEFAULT '',
	`automation_id` varchar(48) NOT NULL,
	CONSTRAINT `action_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `add_on` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`name` varchar(256) NOT NULL,
	`active` boolean NOT NULL DEFAULT false,
	`price_id` varchar(48) NOT NULL,
	`agency_id` varchar(48),
	CONSTRAINT `add_on_id` PRIMARY KEY(`id`),
	CONSTRAINT `add_on_price_id_unique` UNIQUE(`price_id`)
);
--> statement-breakpoint
CREATE TABLE `agency_sidebar_option` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`name` varchar(256) NOT NULL,
	`link` text NOT NULL DEFAULT ('#'),
	`icon` enum('settings','chart','calendar','check','chip','compass','database','flag','home','info','link','lock','messages','notification','payment','power','receipt','shield','star','tune','videorecorder','wallet','warning','headphone','send','pipelines','person','category','contact','clipboardIcon') NOT NULL DEFAULT 'info',
	`agency_id` varchar(48),
	CONSTRAINT `agency_sidebar_option_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agency` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`customer_id` varchar(48) NOT NULL DEFAULT '',
	`connect_account_id` varchar(48) DEFAULT '',
	`name` varchar(256) NOT NULL,
	`agency_logo` varchar(128) NOT NULL,
	`company_email` varchar(256) NOT NULL,
	`company_phone` varchar(16) NOT NULL,
	`white_label` boolean NOT NULL DEFAULT true,
	`address` varchar(64) NOT NULL,
	`goal` int NOT NULL DEFAULT 5,
	CONSTRAINT `agency_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `automation_instance` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`active` boolean NOT NULL DEFAULT false,
	`automation_id` varchar(48) NOT NULL,
	CONSTRAINT `automation_instance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `automation` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`name` varchar(256) NOT NULL,
	`published` boolean NOT NULL DEFAULT false,
	`trigger_id` varchar(48),
	`sub_account_id` varchar(48) NOT NULL,
	CONSTRAINT `automation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `class_name` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`name` varchar(256) NOT NULL,
	`color` varchar(32) NOT NULL,
	`custom_data` text,
	`funnel_id` varchar(48) NOT NULL,
	CONSTRAINT `class_name_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`name` varchar(256) NOT NULL,
	`email` varchar(256) NOT NULL,
	`sub_account_id` varchar(48) NOT NULL,
	CONSTRAINT `contact_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `funnel_page` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`name` varchar(256) NOT NULL,
	`path_name` varchar(256) NOT NULL DEFAULT '',
	`visits` int NOT NULL DEFAULT 0,
	`content` text,
	`order` int,
	`preview_image` text,
	`funnel_id` varchar(48) NOT NULL,
	CONSTRAINT `funnel_page_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `funnel` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` varchar(512),
	`published` boolean NOT NULL DEFAULT false,
	`sub_domain_name` varchar(256),
	`favicon` varchar(256),
	`live_products` json NOT NULL DEFAULT ('[]'),
	`sub_account_id` varchar(48) NOT NULL,
	CONSTRAINT `funnel_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invitation` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`email` varchar(256) NOT NULL,
	`invitation_status` enum('ACCEPTED','REVOKED','PENDING') NOT NULL DEFAULT 'PENDING',
	`role` enum('AGENCY_OWNER','AGENCY_ADMIN','SUBACCOUNT_USER','SUBACCOUNT_GUEST') NOT NULL DEFAULT 'SUBACCOUNT_USER',
	`agency_id` varchar(48),
	CONSTRAINT `invitation_id` PRIMARY KEY(`id`),
	CONSTRAINT `invitation_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `lane` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`name` varchar(256) NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`pipeline_id` varchar(48) NOT NULL,
	CONSTRAINT `lane_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`name` varchar(256) NOT NULL,
	`type` varchar(128),
	`link` varchar(1024) NOT NULL,
	`sub_account_id` varchar(48) NOT NULL,
	CONSTRAINT `media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notification` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`text` text NOT NULL,
	`user_id` varchar(48) NOT NULL,
	`agency_id` varchar(48) NOT NULL,
	`sub_account_id` varchar(48),
	CONSTRAINT `notification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `oauth_account` (
	`id` varchar(48) NOT NULL,
	`username` varchar(256) NOT NULL,
	`provider` enum('google','github') NOT NULL,
	`provider_user_id` varchar(64) NOT NULL,
	`access_token` text NOT NULL,
	`refresh_token` text,
	`expires_at` timestamp,
	`user_id` varchar(48) NOT NULL,
	CONSTRAINT `oauth_account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `permission` (
	`id` varchar(48) NOT NULL,
	`access` boolean NOT NULL DEFAULT false,
	`email` varchar(256) NOT NULL,
	`sub_account_id` varchar(48) NOT NULL,
	CONSTRAINT `permission_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pipeline` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`name` varchar(256) NOT NULL,
	`sub_account_id` varchar(48) NOT NULL,
	CONSTRAINT `pipeline_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(48) NOT NULL,
	`expires_at` datetime NOT NULL,
	`browser` varchar(32) NOT NULL DEFAULT '',
	`os` varchar(32) NOT NULL DEFAULT '',
	`ip` varchar(32) NOT NULL DEFAULT '',
	`user_id` varchar(24) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sub_account_sidebar_option` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`name` varchar(256) NOT NULL,
	`link` text NOT NULL DEFAULT ('#'),
	`icon` enum('settings','chart','calendar','check','chip','compass','database','flag','home','info','link','lock','messages','notification','payment','power','receipt','shield','star','tune','videorecorder','wallet','warning','headphone','send','pipelines','person','category','contact','clipboardIcon') NOT NULL DEFAULT 'info',
	`sub_account_id` varchar(48),
	CONSTRAINT `sub_account_sidebar_option_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sub_account` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`connect_account_id` varchar(48) DEFAULT '',
	`name` varchar(256) NOT NULL,
	`sub_account_logo` varchar(128) NOT NULL,
	`company_email` varchar(256) NOT NULL,
	`company_phone` varchar(16) NOT NULL,
	`address` varchar(64) NOT NULL,
	`goal` int NOT NULL DEFAULT 5,
	`agency_id` varchar(48) NOT NULL,
	CONSTRAINT `sub_account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscription` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`plan` enum('price_1OYxkqFj9oKEERu1NbKUxXxN','price_1OYxkqFj9oKEERu1KfJGWxgN'),
	`price` varchar(8),
	`active` boolean NOT NULL DEFAULT false,
	`price_id` varchar(48) NOT NULL,
	`customer_id` varchar(48) NOT NULL,
	`subscription_id` varchar(48) NOT NULL,
	`current_period_end_date` datetime,
	`agency_id` varchar(48),
	CONSTRAINT `subscription_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscription_subscription_id_unique` UNIQUE(`subscription_id`)
);
--> statement-breakpoint
CREATE TABLE `tag` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`name` varchar(256) NOT NULL,
	`color` varchar(32) NOT NULL,
	`sub_account_id` varchar(48) NOT NULL,
	CONSTRAINT `tag_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tags_to_tickets` (
	`tag_id` varchar(48) NOT NULL,
	`ticket_id` varchar(48) NOT NULL,
	CONSTRAINT `tags_to_tickets_tag_id_ticket_id_pk` PRIMARY KEY(`tag_id`,`ticket_id`)
);
--> statement-breakpoint
CREATE TABLE `ticket` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`name` varchar(256) NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`value` decimal,
	`description` varchar(512),
	`lane_id` varchar(48) NOT NULL,
	`customer_id` varchar(48),
	`assigned_user_id` varchar(48),
	CONSTRAINT `ticket_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trigger` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`name` varchar(256) NOT NULL,
	`type` enum('CONTACT_FORM') NOT NULL,
	`sub_account_id` varchar(48) NOT NULL,
	CONSTRAINT `trigger_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(48) NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	`name` varchar(256) NOT NULL,
	`avatar_url` text NOT NULL,
	`email` varchar(256) NOT NULL,
	`password` varchar(256),
	`role` enum('AGENCY_OWNER','AGENCY_ADMIN','SUBACCOUNT_USER','SUBACCOUNT_GUEST') NOT NULL DEFAULT 'SUBACCOUNT_USER',
	`email_verified` datetime,
	`two_factor_enabled` boolean NOT NULL DEFAULT false,
	`agency_id` varchar(48),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `action` ADD CONSTRAINT `action_automation_id_automation_id_fk` FOREIGN KEY (`automation_id`) REFERENCES `automation`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `add_on` ADD CONSTRAINT `add_on_agency_id_agency_id_fk` FOREIGN KEY (`agency_id`) REFERENCES `agency`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `agency_sidebar_option` ADD CONSTRAINT `agency_sidebar_option_agency_id_agency_id_fk` FOREIGN KEY (`agency_id`) REFERENCES `agency`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `automation_instance` ADD CONSTRAINT `automation_instance_automation_id_automation_id_fk` FOREIGN KEY (`automation_id`) REFERENCES `automation`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `automation` ADD CONSTRAINT `automation_trigger_id_trigger_id_fk` FOREIGN KEY (`trigger_id`) REFERENCES `trigger`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `automation` ADD CONSTRAINT `automation_sub_account_id_sub_account_id_fk` FOREIGN KEY (`sub_account_id`) REFERENCES `sub_account`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `class_name` ADD CONSTRAINT `class_name_funnel_id_funnel_id_fk` FOREIGN KEY (`funnel_id`) REFERENCES `funnel`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contact` ADD CONSTRAINT `contact_sub_account_id_sub_account_id_fk` FOREIGN KEY (`sub_account_id`) REFERENCES `sub_account`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `funnel_page` ADD CONSTRAINT `funnel_page_funnel_id_funnel_id_fk` FOREIGN KEY (`funnel_id`) REFERENCES `funnel`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `funnel` ADD CONSTRAINT `funnel_sub_account_id_sub_account_id_fk` FOREIGN KEY (`sub_account_id`) REFERENCES `sub_account`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_agency_id_agency_id_fk` FOREIGN KEY (`agency_id`) REFERENCES `agency`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lane` ADD CONSTRAINT `lane_pipeline_id_pipeline_id_fk` FOREIGN KEY (`pipeline_id`) REFERENCES `pipeline`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `media` ADD CONSTRAINT `media_sub_account_id_sub_account_id_fk` FOREIGN KEY (`sub_account_id`) REFERENCES `sub_account`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_agency_id_agency_id_fk` FOREIGN KEY (`agency_id`) REFERENCES `agency`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_sub_account_id_sub_account_id_fk` FOREIGN KEY (`sub_account_id`) REFERENCES `sub_account`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `oauth_account` ADD CONSTRAINT `oauth_account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `permission` ADD CONSTRAINT `permission_email_user_email_fk` FOREIGN KEY (`email`) REFERENCES `user`(`email`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `permission` ADD CONSTRAINT `permission_sub_account_id_sub_account_id_fk` FOREIGN KEY (`sub_account_id`) REFERENCES `sub_account`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pipeline` ADD CONSTRAINT `pipeline_sub_account_id_sub_account_id_fk` FOREIGN KEY (`sub_account_id`) REFERENCES `sub_account`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sub_account_sidebar_option` ADD CONSTRAINT `sub_account_sidebar_option_sub_account_id_agency_id_fk` FOREIGN KEY (`sub_account_id`) REFERENCES `agency`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sub_account` ADD CONSTRAINT `sub_account_agency_id_agency_id_fk` FOREIGN KEY (`agency_id`) REFERENCES `agency`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscription` ADD CONSTRAINT `subscription_agency_id_agency_id_fk` FOREIGN KEY (`agency_id`) REFERENCES `agency`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tag` ADD CONSTRAINT `tag_sub_account_id_sub_account_id_fk` FOREIGN KEY (`sub_account_id`) REFERENCES `sub_account`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tags_to_tickets` ADD CONSTRAINT `tags_to_tickets_tag_id_tag_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tags_to_tickets` ADD CONSTRAINT `tags_to_tickets_ticket_id_ticket_id_fk` FOREIGN KEY (`ticket_id`) REFERENCES `ticket`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_lane_id_lane_id_fk` FOREIGN KEY (`lane_id`) REFERENCES `lane`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_customer_id_contact_id_fk` FOREIGN KEY (`customer_id`) REFERENCES `contact`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_assigned_user_id_user_id_fk` FOREIGN KEY (`assigned_user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `trigger` ADD CONSTRAINT `trigger_sub_account_id_sub_account_id_fk` FOREIGN KEY (`sub_account_id`) REFERENCES `sub_account`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_agency_id_agency_id_fk` FOREIGN KEY (`agency_id`) REFERENCES `agency`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `automation_id_idx` ON `action` (`automation_id`);--> statement-breakpoint
CREATE INDEX `agency_id_idx` ON `add_on` (`agency_id`);--> statement-breakpoint
CREATE INDEX `agency_id_idx` ON `agency_sidebar_option` (`agency_id`);--> statement-breakpoint
CREATE INDEX `automation_id_idx` ON `automation_instance` (`automation_id`);--> statement-breakpoint
CREATE INDEX `trigger_id_idx` ON `automation` (`trigger_id`);--> statement-breakpoint
CREATE INDEX `sub_account_id_idx` ON `automation` (`sub_account_id`);--> statement-breakpoint
CREATE INDEX `funnel_id_idx` ON `class_name` (`funnel_id`);--> statement-breakpoint
CREATE INDEX `sub_account_id_idx` ON `contact` (`sub_account_id`);--> statement-breakpoint
CREATE INDEX `funnel_id_idx` ON `funnel_page` (`funnel_id`);--> statement-breakpoint
CREATE INDEX `sub_account_id_idx` ON `funnel` (`sub_account_id`);--> statement-breakpoint
CREATE INDEX `agency_id_idx` ON `invitation` (`agency_id`);--> statement-breakpoint
CREATE INDEX `pipeline_id_idx` ON `lane` (`pipeline_id`);--> statement-breakpoint
CREATE INDEX `sub_account_id_idx` ON `media` (`sub_account_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `notification` (`user_id`);--> statement-breakpoint
CREATE INDEX `agency_id_idx` ON `notification` (`agency_id`);--> statement-breakpoint
CREATE INDEX `sub_account_id_idx` ON `notification` (`sub_account_id`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `permission` (`email`);--> statement-breakpoint
CREATE INDEX `sub_account_id_idx` ON `permission` (`sub_account_id`);--> statement-breakpoint
CREATE INDEX `sub_account_id_idx` ON `pipeline` (`sub_account_id`);--> statement-breakpoint
CREATE INDEX `sub_account_id_idx` ON `sub_account_sidebar_option` (`sub_account_id`);--> statement-breakpoint
CREATE INDEX `agency_id_idx` ON `sub_account` (`agency_id`);--> statement-breakpoint
CREATE INDEX `agency_id_idx` ON `subscription` (`agency_id`);--> statement-breakpoint
CREATE INDEX `customer_id_idx` ON `subscription` (`customer_id`);--> statement-breakpoint
CREATE INDEX `sub_account_id_idx` ON `tag` (`sub_account_id`);--> statement-breakpoint
CREATE INDEX `lane_id_idx` ON `ticket` (`lane_id`);--> statement-breakpoint
CREATE INDEX `customer_id_idx` ON `ticket` (`customer_id`);--> statement-breakpoint
CREATE INDEX `assigned_user_id_idx` ON `ticket` (`assigned_user_id`);--> statement-breakpoint
CREATE INDEX `sub_account_id_idx` ON `trigger` (`sub_account_id`);--> statement-breakpoint
CREATE INDEX `agency_id_idx` ON `user` (`agency_id`);