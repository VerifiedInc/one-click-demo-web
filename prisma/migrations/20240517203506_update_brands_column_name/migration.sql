-- AlterTable
ALTER TABLE "State" ADD COLUMN     "primaryEnvBrand" TEXT,
ADD COLUMN     "secondaryEnvBrand" TEXT,
ALTER COLUMN "dummyBrand" DROP NOT NULL,
ALTER COLUMN "realBrand" DROP NOT NULL;
