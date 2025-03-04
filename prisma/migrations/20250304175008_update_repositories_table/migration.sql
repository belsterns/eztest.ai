/*
  Warnings:

  - The primary key for the `repositories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `nocobase_id` on the `repositories` table. All the data in the column will be lost.
  - Added the required column `user_uuid` to the `repositories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspace_uuid` to the `repositories` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "repositories_nocobase_id_key";

-- AlterTable
ALTER TABLE "repositories" DROP CONSTRAINT "repositories_pkey",
DROP COLUMN "id",
DROP COLUMN "nocobase_id",
ADD COLUMN     "user_uuid" UUID NOT NULL,
ADD COLUMN     "workspace_uuid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repositories" ADD CONSTRAINT "repositories_workspace_uuid_fkey" FOREIGN KEY ("workspace_uuid") REFERENCES "workspaces"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
