/*
  Warnings:

  - Made the column `challenge` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "challenge" SET NOT NULL,
ALTER COLUMN "challenge" SET DEFAULT '-';
