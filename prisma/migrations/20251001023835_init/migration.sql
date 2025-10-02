/*
  Warnings:

  - You are about to drop the column `user_id` on the `Board` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `profile_id` to the `Board` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Board" DROP CONSTRAINT "Board_user_id_fkey";

-- DropIndex
DROP INDEX "public"."Board_user_id_idx";

-- AlterTable
ALTER TABLE "public"."Board" DROP COLUMN "user_id",
ADD COLUMN     "profile_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" TEXT NOT NULL,
    "supabaseId" TEXT NOT NULL,
    "name" TEXT,
    "photo_profile" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_supabaseId_key" ON "public"."Profile"("supabaseId");

-- CreateIndex
CREATE INDEX "Board_profile_id_idx" ON "public"."Board"("profile_id");

-- AddForeignKey
ALTER TABLE "public"."Board" ADD CONSTRAINT "Board_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
