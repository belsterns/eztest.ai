/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `org_roles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_by" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "org_roles_name_key" ON "org_roles"("name");
