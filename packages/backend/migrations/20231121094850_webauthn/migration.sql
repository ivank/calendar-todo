/*
  Warnings:

  - You are about to drop the `Credentail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Credentail" DROP CONSTRAINT "Credentail_userId_fkey";

-- DropTable
DROP TABLE "Credentail";

-- CreateTable
CREATE TABLE "Authenticator" (
    "id" SERIAL NOT NULL,
    "credentailId" TEXT NOT NULL,
    "credentialPublicKey" BYTEA NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "counter" BIGINT NOT NULL,
    "transports" TEXT[],
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
