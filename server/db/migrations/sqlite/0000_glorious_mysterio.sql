CREATE TABLE `content_activity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content_slug` text NOT NULL,
	`activity_type` text NOT NULL,
	`network` text,
	`session_id` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `content_meta` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`shares` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_meta_slug_unique` ON `content_meta` (`slug`);--> statement-breakpoint
CREATE TABLE `reactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content_slug` text NOT NULL,
	`type` text NOT NULL,
	`section` text NOT NULL,
	`count` integer DEFAULT 1 NOT NULL,
	`session_id` text NOT NULL,
	`created_at` text NOT NULL
);
