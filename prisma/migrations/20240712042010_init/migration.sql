/*
  Warnings:

  - Added the required column `theaterId` to the `shows` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shows` ADD COLUMN `theaterId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `shows` ADD CONSTRAINT `shows_theaterId_fkey` FOREIGN KEY (`theaterId`) REFERENCES `theaters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
