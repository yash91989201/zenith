ALTER TABLE `sub_account_sidebar_option` DROP FOREIGN KEY `sub_account_sidebar_option_sub_account_id_agency_id_fk`;
--> statement-breakpoint
ALTER TABLE `sub_account_sidebar_option` ADD CONSTRAINT `sub_account_sidebar_option_sub_account_id_sub_account_id_fk` FOREIGN KEY (`sub_account_id`) REFERENCES `sub_account`(`id`) ON DELETE no action ON UPDATE no action;