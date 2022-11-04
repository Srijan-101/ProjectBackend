/*
  Warnings:

  - You are about to drop the column `Qty` on the `MenuItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "customerTable" DROP CONSTRAINT "customerTable_billAmountId_fkey";

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "Qty";

-- AlterTable
ALTER TABLE "customerTable" ALTER COLUMN "billAmountId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "customerTable" ADD CONSTRAINT "customerTable_billAmountId_fkey" FOREIGN KEY ("billAmountId") REFERENCES "BillAmount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
