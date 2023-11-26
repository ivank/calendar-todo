/*
  Warnings:

  - A unique constraint covering the columns `[userId,position,type]` on the table `List` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "List_userId_position_key";

-- DropIndex
DROP INDEX "List_userId_position_type_idx";

-- CreateIndex
CREATE INDEX "List_userId_idx" ON "List"("userId");

-- CreateIndex
CREATE INDEX "List_position_idx" ON "List"("position");

-- CreateIndex
CREATE INDEX "List_type_idx" ON "List"("type");

-- CreateIndex
CREATE UNIQUE INDEX "List_userId_position_type_key" ON "List"("userId", "position", "type");
