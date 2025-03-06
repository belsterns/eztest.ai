-- CreateTable
CREATE TABLE "users" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" VARCHAR(255) NOT NULL,
    "organization_name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "org_role_uuid" UUID NOT NULL,
    "created_by" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "org_roles" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "org_roles_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "workspaces" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "user_workspaces" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_uuid" UUID NOT NULL,
    "workspace_uuid" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_workspaces_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "repositories" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_uuid" UUID NOT NULL,
    "workspace_uuid" UUID NOT NULL,
    "host_url" TEXT NOT NULL,
    "webhook_uuid" TEXT NOT NULL,
    "remote_origin" TEXT NOT NULL,
    "organization_name" TEXT NOT NULL,
    "repo_name" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_initialized" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repositories_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_uuid_key" ON "users"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "org_roles_uuid_key" ON "org_roles"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "org_roles_name_key" ON "org_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_uuid_key" ON "workspaces"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_workspaces_uuid_key" ON "user_workspaces"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_workspaces_user_uuid_workspace_uuid_key" ON "user_workspaces"("user_uuid", "workspace_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "repositories_uuid_key" ON "repositories"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "repositories_webhook_uuid_key" ON "repositories"("webhook_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "repositories_user_uuid_workspace_uuid_key" ON "repositories"("user_uuid", "workspace_uuid");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_org_role_uuid_fkey" FOREIGN KEY ("org_role_uuid") REFERENCES "org_roles"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workspaces" ADD CONSTRAINT "user_workspaces_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workspaces" ADD CONSTRAINT "user_workspaces_workspace_uuid_fkey" FOREIGN KEY ("workspace_uuid") REFERENCES "workspaces"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_workspace_uuid_fkey" FOREIGN KEY ("workspace_uuid") REFERENCES "workspaces"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
