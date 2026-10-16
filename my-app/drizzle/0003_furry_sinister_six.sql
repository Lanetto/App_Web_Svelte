CREATE TABLE `draw_states` (
	`session_id` text PRIMARY KEY NOT NULL,
	`hand` text NOT NULL,
	`library` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `deck_cards` ADD `session_id` text DEFAULT '' NOT NULL;