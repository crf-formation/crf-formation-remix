/*
  Warnings:

  - A unique constraint covering the columns `[pseUserConcreteCaseId,pseCompetenceId]` on the table `PseUserConcreteCaseCompetence` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PseUserConcreteCaseCompetence_pseUserConcreteCaseId_pseCompetenceId_key" ON "PseUserConcreteCaseCompetence"("pseUserConcreteCaseId", "pseCompetenceId");
