ALTER TABLE `tickets_to_tags` DROP FOREIGN KEY `tickets_to_tags_tag_id_tag_id_fk`;
--> statement-breakpoint
ALTER TABLE `tickets_to_tags` DROP FOREIGN KEY `tickets_to_tags_ticket_id_ticket_id_fk`;
--> statement-breakpoint
ALTER TABLE `tickets_to_tags` ADD CONSTRAINT `tickets_to_tags_tag_id_tag_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tickets_to_tags` ADD CONSTRAINT `tickets_to_tags_ticket_id_ticket_id_fk` FOREIGN KEY (`ticket_id`) REFERENCES `ticket`(`id`) ON DELETE cascade ON UPDATE no action;