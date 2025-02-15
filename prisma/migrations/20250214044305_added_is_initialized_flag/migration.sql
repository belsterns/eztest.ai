/*
  Warnings:

  - You are about to drop the column `webhook_url` on the `repositories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[webhook_uuid]` on the table `repositories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `is_initialized` to the `repositories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `webhook_uuid` to the `repositories` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "repositories_webhook_url_key";

-- AlterTable
ALTER TABLE "repositories" DROP COLUMN "webhook_url",
ADD COLUMN     "is_initialized" BOOLEAN NOT NULL,
ADD COLUMN     "webhook_uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "repositories_webhook_uuid_key" ON "repositories"("webhook_uuid");
