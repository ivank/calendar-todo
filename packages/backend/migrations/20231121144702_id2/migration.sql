/*
  Warnings:

  - You are about to drop the column `credentailID` on the `Authenticator` table. All the data in the column will be lost.
  - Added the required column `credentialID` to the `Authenticator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Authenticator" DROP COLUMN "credentailID",
ADD COLUMN     "credentialID" TEXT NOT NULL;
