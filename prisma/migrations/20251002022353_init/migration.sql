/*
  Warnings:

  - Added the required column `is_done` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Task" ADD COLUMN     "is_done" BOOLEAN NOT NULL;
