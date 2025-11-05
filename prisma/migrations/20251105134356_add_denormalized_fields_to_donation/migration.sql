/*
  Warnings:

  - Added the required column `childName` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentName` to the `Donation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Donation" ADD COLUMN     "childName" TEXT NOT NULL,
ADD COLUMN     "departmentName" TEXT NOT NULL;
