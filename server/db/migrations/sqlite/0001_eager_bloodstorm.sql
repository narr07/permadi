CREATE TABLE `gallery_likes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`gallery_stem` text NOT NULL,
	`ip_address` text NOT NULL,
	`created_at` integer NOT NULL
);
