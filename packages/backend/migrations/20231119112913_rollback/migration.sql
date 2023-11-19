/*
  Warnings:

  - You are about to drop the `TodoDay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TodoNamed` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TodoDay" DROP CONSTRAINT "TodoDay_todoDayListId_fkey";

-- DropForeignKey
ALTER TABLE "TodoNamed" DROP CONSTRAINT "TodoNamed_todoNamedListId_fkey";

-- AlterTable
ALTER TABLE "TodoDayList" ADD COLUMN     "items" JSONB[];

-- AlterTable
ALTER TABLE "TodoNamedList" ADD COLUMN     "items" JSONB[];

-- DropTable
DROP TABLE "TodoDay";

-- DropTable
DROP TABLE "TodoNamed";
