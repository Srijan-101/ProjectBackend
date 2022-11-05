/*
  Warnings:

  - Added the required column `AdminId` to the `Outlet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Outlet" ADD COLUMN     "AdminId" TEXT NOT NULL;
