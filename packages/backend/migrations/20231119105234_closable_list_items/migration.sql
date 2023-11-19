/*
  Warnings:

  - The `items` column on the `TodoDayList` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `items` column on the `TodoNamedList` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TodoDayList" DROP COLUMN "items",
ADD COLUMN     "items" JSONB[];

-- AlterTable
ALTER TABLE "TodoNamedList" DROP COLUMN "items",
ADD COLUMN     "items" JSONB[];
