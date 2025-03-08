/*
  Warnings:

  - A unique constraint covering the columns `[repo_url]` on the table `repositories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `repo_url` to the `repositories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "repositories" ADD COLUMN     "repo_url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "repositories_repo_url_key" ON "repositories"("repo_url");
