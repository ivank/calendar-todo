/*
  Warnings:

  - You are about to drop the `TodoDayList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TodoNamedList` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ListType" AS ENUM ('DAY', 'NAMED');

-- DropForeignKey
ALTER TABLE "TodoDayList" DROP CONSTRAINT "TodoDayList_userId_fkey";

-- DropForeignKey
ALTER TABLE "TodoNamedList" DROP CONSTRAINT "TodoNamedList_userId_fkey";

-- DropTable
DROP TABLE "TodoDayList";

-- DropTable
DROP TABLE "TodoNamedList";

-- CreateTable
CREATE TABLE "List" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "items" JSONB[],
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "position" INTEGER NOT NULL,
    "type" "ListType" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "List_userId_position_type_idx" ON "List"("userId", "position", "type");

-- CreateIndex
CREATE UNIQUE INDEX "List_userId_position_key" ON "List"("userId", "position");

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
