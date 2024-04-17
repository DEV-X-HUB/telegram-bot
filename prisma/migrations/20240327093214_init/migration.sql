/*
  Warnings:

  - The `status` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('approved', 'pending', 'rejected');

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "status",
ADD COLUMN     "status" "QuestionStatus" NOT NULL DEFAULT 'pending';
