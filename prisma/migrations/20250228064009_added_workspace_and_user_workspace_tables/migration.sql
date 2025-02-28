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

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_uuid_key" ON "workspaces"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_workspaces_uuid_key" ON "user_workspaces"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_workspaces_user_uuid_workspace_uuid_key" ON "user_workspaces"("user_uuid", "workspace_uuid");

-- AddForeignKey
ALTER TABLE "user_workspaces" ADD CONSTRAINT "user_workspaces_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workspaces" ADD CONSTRAINT "user_workspaces_workspace_uuid_fkey" FOREIGN KEY ("workspace_uuid") REFERENCES "workspaces"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
