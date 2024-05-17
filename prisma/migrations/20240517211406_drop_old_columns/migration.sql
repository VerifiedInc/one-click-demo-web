/*
  Warnings:

  - You are about to drop the column `dummyBrand` on the `State` table. All the data in the column will be lost.
  - You are about to drop the column `realBrand` on the `State` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "State" DROP COLUMN "dummyBrand",
DROP COLUMN "realBrand";
