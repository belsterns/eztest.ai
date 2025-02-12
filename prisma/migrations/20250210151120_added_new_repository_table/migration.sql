-- CreateTable
CREATE TABLE "Repository" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nocobase_id" TEXT NOT NULL,
    "host_url" TEXT NOT NULL,
    "webhook_url" TEXT NOT NULL,
    "remote_origin" TEXT NOT NULL,
    "organization_name" TEXT NOT NULL,
    "repo_name" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Repository_uuid_key" ON "Repository"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_webhook_url_key" ON "Repository"("webhook_url");
