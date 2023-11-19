-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TodoNamedList" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "items" TEXT[],
    "userId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderBy" INTEGER NOT NULL,

    CONSTRAINT "TodoNamedList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TodoDayList" (
    "id" SERIAL NOT NULL,
    "items" TEXT[],
    "userId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TodoDayList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

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

-- AddForeignKey
ALTER TABLE "TodoNamedList" ADD CONSTRAINT "TodoNamedList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TodoDayList" ADD CONSTRAINT "TodoDayList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
