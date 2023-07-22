/*
  Warnings:

  - Added the required column `model_id` to the `conversations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model_id` to the `prompts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "model_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "prompts" ADD COLUMN     "model_id" TEXT NOT NULL;
