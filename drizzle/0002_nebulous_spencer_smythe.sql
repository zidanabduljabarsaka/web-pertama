CREATE TABLE `tokens` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`token` varchar(255) NOT NULL,
	`user_id` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `tokens_id` PRIMARY KEY(`id`)
);
