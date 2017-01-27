-- This creates the users table. The username field is constrained to unique
-- values only, by using a UNIQUE KEY on that column
CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(60) NOT NULL, -- why 60??? ask me :)
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
);

-- This creates the posts table. The userId column references the id column of
-- users. If a user is deleted, the corresponding posts' userIds will be set NULL.
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT NULL,
  `url` varchar(2000) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`), -- why did we add this here? ask me :)
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL
);

CREATE TABLE `reddit_api`.`subreddits` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(30) NOT NULL ,
  `description` VARCHAR(200) NOT NULL ,
  `createdAt` DATETIME NOT NULL ,
  `updatedAt` DATETIME NOT NULL ,
  PRIMARY KEY (`id`), UNIQUE (`name`))
  ENGINE = InnoDB;

ALTER TABLE `posts` ADD `subredditId` INT(11) NOT NULL AFTER `id`;

CREATE TABLE `reddit_api`.`votes`(
  `userId` INT(11) NOT NULL,
  `postId` INT(11) NOT NULL,
  `vote` TINYINT NOT NULL,
  `createdOn` DATETIME,
  `modifiedOn` DATETIME,
  PRIMARY KEY (`userId`,`postId`)
);
