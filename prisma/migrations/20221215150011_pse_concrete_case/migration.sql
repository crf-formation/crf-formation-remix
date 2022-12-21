-- CreateTable
CREATE TABLE "PseCompetence" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "PseConcreteCaseType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PseCompetencesOnPseConcreteCaseTypes" (
    "pseCompetenceId" TEXT NOT NULL,
    "pseConcreteCaseTypeId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("pseCompetenceId", "pseConcreteCaseTypeId"),
    CONSTRAINT "PseCompetencesOnPseConcreteCaseTypes_pseCompetenceId_fkey" FOREIGN KEY ("pseCompetenceId") REFERENCES "PseCompetence" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PseCompetencesOnPseConcreteCaseTypes_pseConcreteCaseTypeId_fkey" FOREIGN KEY ("pseConcreteCaseTypeId") REFERENCES "PseConcreteCaseType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PseConcreteCaseGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "pseConcreteCaseSessionId" TEXT NOT NULL,
    CONSTRAINT "PseConcreteCaseGroup_pseConcreteCaseSessionId_fkey" FOREIGN KEY ("pseConcreteCaseSessionId") REFERENCES "PseConcreteCaseSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PseUserConcreteCaseGroupStudent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "pseConcreteCaseGroupId" TEXT NOT NULL,
    CONSTRAINT "PseUserConcreteCaseGroupStudent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PseUserConcreteCaseGroupStudent_pseConcreteCaseGroupId_fkey" FOREIGN KEY ("pseConcreteCaseGroupId") REFERENCES "PseConcreteCaseGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PseConcreteCaseSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "formationId" TEXT NOT NULL,
    CONSTRAINT "PseConcreteCaseSession_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "PseFormation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PseConcreteCaseSituation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teacherId" TEXT NOT NULL,
    "pseConcreteCaseTypeId" TEXT NOT NULL,
    "pseConcreteCaseSessionId" TEXT NOT NULL,
    CONSTRAINT "PseConcreteCaseSituation_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PseConcreteCaseSituation_pseConcreteCaseTypeId_fkey" FOREIGN KEY ("pseConcreteCaseTypeId") REFERENCES "PseConcreteCaseType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PseConcreteCaseSituation_pseConcreteCaseSessionId_fkey" FOREIGN KEY ("pseConcreteCaseSessionId") REFERENCES "PseConcreteCaseSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PseSituationConcreteCaseGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "position" INTEGER NOT NULL DEFAULT -1,
    "pseConcreteCaseSessionId" TEXT NOT NULL,
    "pseConcreteCaseGroupId" TEXT NOT NULL,
    "pseConcreteCaseSituationId" TEXT NOT NULL,
    CONSTRAINT "PseSituationConcreteCaseGroup_pseConcreteCaseSessionId_fkey" FOREIGN KEY ("pseConcreteCaseSessionId") REFERENCES "PseConcreteCaseSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PseSituationConcreteCaseGroup_pseConcreteCaseGroupId_fkey" FOREIGN KEY ("pseConcreteCaseGroupId") REFERENCES "PseConcreteCaseGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PseSituationConcreteCaseGroup_pseConcreteCaseSituationId_fkey" FOREIGN KEY ("pseConcreteCaseSituationId") REFERENCES "PseConcreteCaseSituation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PseUserConcreteCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" TEXT NOT NULL,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "concreteCaseGroupId" TEXT NOT NULL,
    "concreteCaseTypeId" TEXT NOT NULL,
    CONSTRAINT "PseUserConcreteCase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PseUserConcreteCase_concreteCaseGroupId_fkey" FOREIGN KEY ("concreteCaseGroupId") REFERENCES "PseConcreteCaseGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PseUserConcreteCase_concreteCaseTypeId_fkey" FOREIGN KEY ("concreteCaseTypeId") REFERENCES "PseConcreteCaseType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PseUserConcreteCaseCompetence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grade" TEXT NOT NULL,
    "pseUserConcreteCaseId" TEXT NOT NULL,
    "pseCompetenceId" TEXT NOT NULL,
    CONSTRAINT "PseUserConcreteCaseCompetence_pseUserConcreteCaseId_fkey" FOREIGN KEY ("pseUserConcreteCaseId") REFERENCES "PseUserConcreteCase" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PseUserConcreteCaseCompetence_pseCompetenceId_fkey" FOREIGN KEY ("pseCompetenceId") REFERENCES "PseCompetence" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
