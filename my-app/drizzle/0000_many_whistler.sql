CREATE TABLE `cards` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`desc` text NOT NULL,
	`race` text,
	`attribute` text,
	`atk` integer,
	`def` integer,
	`level` integer,
	`imageUrl` text
);
