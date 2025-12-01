/*
  Warnings:

  - Made the column `caption` on table `Submission` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "reportCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "caption" SET NOT NULL;
