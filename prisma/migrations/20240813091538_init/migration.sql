-- CreateTable
CREATE TABLE `users` (
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `token` VARCHAR(100) NULL,
    `isAdmin` BOOLEAN NOT NULL,

    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullname` VARCHAR(100) NOT NULL,
    `photo` VARCHAR(100) NULL,
    `email` VARCHAR(100) NULL,
    `phone` VARCHAR(20) NULL,
    `gender` VARCHAR(20) NULL,
    `amount` INTEGER NULL,
    `dateofbirth` DATETIME(3) NULL,
    `ofcNo` VARCHAR(20) NULL,
    `isGetTicket` BOOLEAN NOT NULL,
    `nationalId` INTEGER NULL,
    `username` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `street` VARCHAR(255) NULL,
    `city` VARCHAR(100) NULL,
    `province` VARCHAR(100) NULL,
    `country` VARCHAR(100) NOT NULL,
    `postal_code` VARCHAR(10) NOT NULL,
    `contactId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shows` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `photo` VARCHAR(100) NULL,
    `description` VARCHAR(2000) NULL,
    `duration` VARCHAR(50) NULL,
    `rating` VARCHAR(20) NULL,
    `price` INTEGER NULL,
    `theaterId` INTEGER NOT NULL,
    `showtimeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `showtimes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `showDate` DATETIME(3) NULL,
    `showTime` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `theaters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `photo` VARCHAR(100) NULL,
    `location` VARCHAR(255) NULL,
    `capacity` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tickets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `seatNumber` VARCHAR(255) NOT NULL,
    `photo` VARCHAR(100) NULL,
    `purchaseDate` DATETIME(3) NULL,
    `status` VARCHAR(100) NULL,
    `showId` INTEGER NOT NULL,
    `contactId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `paymentUrl` VARCHAR(255) NULL,
    `ticketId` INTEGER NOT NULL,

    UNIQUE INDEX `orders_orderId_key`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tmp_shuffle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `isShuffle` BOOLEAN NOT NULL,
    `contactId` INTEGER NOT NULL,
    `ticketId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `contacts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shows` ADD CONSTRAINT `shows_theaterId_fkey` FOREIGN KEY (`theaterId`) REFERENCES `theaters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shows` ADD CONSTRAINT `shows_showtimeId_fkey` FOREIGN KEY (`showtimeId`) REFERENCES `showtimes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_showId_fkey` FOREIGN KEY (`showId`) REFERENCES `shows`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `contacts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `tickets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tmp_shuffle` ADD CONSTRAINT `tmp_shuffle_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `contacts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tmp_shuffle` ADD CONSTRAINT `tmp_shuffle_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `tickets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
