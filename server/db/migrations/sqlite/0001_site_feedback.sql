CREATE TABLE IF NOT EXISTS `site_feedback` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category` text NOT NULL,
	`message` text NOT NULL,
	`email` text,
	`page` text,
	`locale` text,
	`ip_hash` text NOT NULL,
	`created_at` text NOT NULL
);
