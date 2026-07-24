CREATE TABLE `reactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_id` integer NOT NULL,
	`reaction_type` text NOT NULL,
	`ip_address` text NOT NULL,
	`created_at` integer NOT NULL
);
