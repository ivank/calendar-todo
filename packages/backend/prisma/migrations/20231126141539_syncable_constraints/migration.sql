-- DropIndex
DROP INDEX "List_position_idx";

-- DropIndex
DROP INDEX "List_type_idx";

-- DropIndex
DROP INDEX "List_userId_idx";

-- CreateIndex
CREATE INDEX "List_userId_position_type_idx" ON "List"("userId", "position", "type");
