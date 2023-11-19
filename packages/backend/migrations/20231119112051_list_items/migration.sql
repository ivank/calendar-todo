/*
  Warnings:

  - You are about to drop the column `items` on the `TodoDayList` table. All the data in the column will be lost.
  - You are about to drop the column `items` on the `TodoNamedList` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TodoDayList" DROP COLUMN "items";

-- AlterTable
ALTER TABLE "TodoNamedList" DROP COLUMN "items";

-- CreateTable
CREATE TABLE "TodoNamed" (
    "id" SERIAL NOT NULL,
    "todoNamedListId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TodoNamed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TodoDay" (
    "id" SERIAL NOT NULL,
    "todoDayListId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TodoDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TodoNamed_todoNamedListId_idx" ON "TodoNamed"("todoNamedListId");

-- CreateIndex
CREATE INDEX "TodoDay_todoDayListId_idx" ON "TodoDay"("todoDayListId");

-- AddForeignKey
ALTER TABLE "TodoNamed" ADD CONSTRAINT "TodoNamed_todoNamedListId_fkey" FOREIGN KEY ("todoNamedListId") REFERENCES "TodoNamedList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TodoDay" ADD CONSTRAINT "TodoDay_todoDayListId_fkey" FOREIGN KEY ("todoDayListId") REFERENCES "TodoDayList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
