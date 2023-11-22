/*
  Warnings:

  - The primary key for the `TodoDayList` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `TodoDayList` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `TodoNamedList` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `TodoNamedList` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `userId` on the `TodoDayList` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `TodoNamedList` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "TodoDayList" DROP CONSTRAINT "TodoDayList_userId_fkey";

-- DropForeignKey
ALTER TABLE "TodoNamedList" DROP CONSTRAINT "TodoNamedList_userId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "TodoDayList" DROP CONSTRAINT "TodoDayList_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "TodoDayList_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TodoNamedList" DROP CONSTRAINT "TodoNamedList_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "TodoNamedList_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "email",
DROP COLUMN "emailVerified",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "Credentail" (
    "id" SERIAL NOT NULL,
    "externalId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "publicKey" TEXT NOT NULL,

    CONSTRAINT "Credentail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TodoDayList_userId_idx" ON "TodoDayList"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TodoDayList_userId_day_key" ON "TodoDayList"("userId", "day");

-- CreateIndex
CREATE INDEX "TodoNamedList_userId_idx" ON "TodoNamedList"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TodoNamedList_userId_orderBy_key" ON "TodoNamedList"("userId", "orderBy");

-- AddForeignKey
ALTER TABLE "TodoNamedList" ADD CONSTRAINT "TodoNamedList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TodoDayList" ADD CONSTRAINT "TodoDayList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credentail" ADD CONSTRAINT "Credentail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
