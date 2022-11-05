/*
  Warnings:

  - You are about to drop the column `saleAmount` on the `Sales` table. All the data in the column will be lost.
  - Added the required column `SaleAmount` to the `Sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sales" DROP COLUMN "saleAmount",
ADD COLUMN     "PaymentMethod" TEXT,
ADD COLUMN     "ReceiptNo" TEXT,
ADD COLUMN     "SaleAmount" DOUBLE PRECISION NOT NULL;
