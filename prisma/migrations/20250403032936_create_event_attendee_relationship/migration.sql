/*
  Warnings:

  - You are about to drop the column `eventId` on the `Attendee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Attendee` DROP FOREIGN KEY `Attendee_eventId_fkey`;

-- DropIndex
DROP INDEX `Attendee_eventId_fkey` ON `Attendee`;

-- AlterTable
ALTER TABLE `Attendee` DROP COLUMN `eventId`;

-- CreateTable
CREATE TABLE `EventRegistration` (
    `eventId` INTEGER NOT NULL,
    `attendeeId` INTEGER NOT NULL,

    PRIMARY KEY (`eventId`, `attendeeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventRegistration` ADD CONSTRAINT `EventRegistration_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventRegistration` ADD CONSTRAINT `EventRegistration_attendeeId_fkey` FOREIGN KEY (`attendeeId`) REFERENCES `Attendee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
