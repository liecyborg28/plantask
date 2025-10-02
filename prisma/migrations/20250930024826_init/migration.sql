/*
  Warnings:

  - You are about to drop the column `owner_id` on the `Board` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[supabaseId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supabaseId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Board" DROP CONSTRAINT "Board_owner_id_fkey";

-- AlterTable
ALTER TABLE "public"."Board" DROP COLUMN "owner_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "password",
ADD COLUMN     "supabaseId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Board_user_id_idx" ON "public"."Board"("user_id");

-- CreateIndex
CREATE INDEX "Category_board_id_idx" ON "public"."Category"("board_id");

-- CreateIndex
CREATE INDEX "Task_category_id_idx" ON "public"."Task"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_supabaseId_key" ON "public"."User"("supabaseId");

-- AddForeignKey
ALTER TABLE "public"."Board" ADD CONSTRAINT "Board_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
