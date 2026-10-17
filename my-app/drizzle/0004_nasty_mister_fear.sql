CREATE TABLE `sync_state` (
	`id` integer PRIMARY KEY NOT NULL,
	`last_sync_at` integer,
	`db_version` text,
	`card_count` integer,
	`last_error` text
);
