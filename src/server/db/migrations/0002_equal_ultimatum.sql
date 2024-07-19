ALTER TABLE `tickets_to_tags` DROP FOREIGN KEY `tickets_to_tags_tag_id_tag_id_fk`;
--> statement-breakpoint
ALTER TABLE `tickets_to_tags` ADD CONSTRAINT `tickets_to_tags_tag_id_tag_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON DELETE no action ON UPDATE no action;