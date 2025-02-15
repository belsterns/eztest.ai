/*
  Warnings:

  - A unique constraint covering the columns `[nocobase_id]` on the table `repositories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "repositories_nocobase_id_key" ON "repositories"("nocobase_id");
