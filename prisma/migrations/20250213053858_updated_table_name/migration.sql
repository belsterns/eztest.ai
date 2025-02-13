/*
  Warnings:

  - You are about to drop the `Repository` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Repository";

-- CreateTable
CREATE TABLE "repositories" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nocobase_id" TEXT NOT NULL,
    "host_url" TEXT NOT NULL,
    "webhook_url" TEXT NOT NULL,
    "remote_origin" TEXT NOT NULL,
    "organization_name" TEXT NOT NULL,
    "repo_name" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repositories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "repositories_uuid_key" ON "repositories"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "repositories_webhook_url_key" ON "repositories"("webhook_url");
