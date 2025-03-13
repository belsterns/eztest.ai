/*
  Warnings:

  - A unique constraint covering the columns `[repo_name]` on the table `repositories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "repositories_repo_name_key" ON "repositories"("repo_name");
