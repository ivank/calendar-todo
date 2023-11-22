/*
  Warnings:

  - You are about to drop the column `credentailId` on the `Authenticator` table. All the data in the column will be lost.
  - Added the required column `credentailID` to the `Authenticator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Authenticator" DROP COLUMN "credentailId",
ADD COLUMN     "credentailID" TEXT NOT NULL;
