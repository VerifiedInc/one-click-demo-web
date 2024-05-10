-- CreateTable
CREATE TABLE "State" (
    "uuid" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "dummyBrand" TEXT NOT NULL,
    "realBrand" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("uuid")
);

