CREATE TABLE `likes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`article_id` text NOT NULL,
	`user_ip` text NOT NULL,
	`created_at` integer NOT NULL
);
