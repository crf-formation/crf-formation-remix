-- CreateTable
CREATE TABLE "PseTechnique" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "requiredForPse1" BOOLEAN NOT NULL,
    "pseModuleId" TEXT NOT NULL,
    CONSTRAINT "PseTechnique_pseModuleId_fkey" FOREIGN KEY ("pseModuleId") REFERENCES "PseModule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PseUserTechnique" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "formationId" TEXT NOT NULL,
    "techniqueId" TEXT NOT NULL,
    "acquired" BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT "PseUserTechnique_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PseUserTechnique_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "PseFormation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PseUserTechnique_techniqueId_fkey" FOREIGN KEY ("techniqueId") REFERENCES "PseTechnique" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PseUserTechnique_userId_formationId_techniqueId_key" ON "PseUserTechnique"("userId", "formationId", "techniqueId");
