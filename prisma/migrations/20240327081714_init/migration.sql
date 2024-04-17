/*
  Warnings:

  - You are about to drop the column `followerId` on the `Follows` table. All the data in the column will be lost.
  - You are about to drop the column `followingId` on the `Follows` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[follower_id,following_id]` on the table `Follows` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `follower_id` to the `Follows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `following_id` to the `Follows` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followingId_fkey";

-- DropIndex
DROP INDEX "Follows_followerId_followingId_key";

-- AlterTable
ALTER TABLE "Follows" DROP COLUMN "followerId",
DROP COLUMN "followingId",
ADD COLUMN     "follower_id" TEXT NOT NULL,
ADD COLUMN     "following_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Follows_follower_id_following_id_key" ON "Follows"("follower_id", "following_id");

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
