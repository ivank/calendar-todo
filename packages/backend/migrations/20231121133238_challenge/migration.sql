/*
  Warnings:

  - You are about to drop the column `registrationChallenge` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "registrationChallenge",
ADD COLUMN     "challenge" TEXT;
