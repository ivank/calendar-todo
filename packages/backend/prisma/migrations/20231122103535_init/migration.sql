-- CreateTable
CREATE TABLE "TodoNamedList" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "items" JSONB[],
    "userId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderBy" INTEGER NOT NULL,

    CONSTRAINT "TodoNamedList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TodoDayList" (
    "id" SERIAL NOT NULL,
    "items" JSONB[],
    "userId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "day" TEXT NOT NULL,

    CONSTRAINT "TodoDayList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Authenticator" (
    "id" SERIAL NOT NULL,
    "credentialID" TEXT NOT NULL,
    "credentialPublicKey" BYTEA NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "counter" BIGINT NOT NULL,
    "transports" TEXT[],
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "challenge" TEXT NOT NULL DEFAULT '-',
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TodoNamedList_userId_idx" ON "TodoNamedList"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TodoNamedList_userId_orderBy_key" ON "TodoNamedList"("userId", "orderBy");

-- CreateIndex
CREATE INDEX "TodoDayList_userId_idx" ON "TodoDayList"("userId");

-- CreateIndex
CREATE INDEX "TodoDayList_day_idx" ON "TodoDayList"("day");

-- CreateIndex
CREATE UNIQUE INDEX "TodoDayList_userId_day_key" ON "TodoDayList"("userId", "day");

-- CreateIndex
CREATE INDEX "Authenticator_credentialID_idx" ON "Authenticator"("credentialID");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "TodoNamedList" ADD CONSTRAINT "TodoNamedList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TodoDayList" ADD CONSTRAINT "TodoDayList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
