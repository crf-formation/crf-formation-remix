-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PseUserPreparatoryWork" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "formationId" TEXT NOT NULL,
    "pseModuleId" TEXT NOT NULL,
    "openingDate" DATETIME,
    "realisedDate" DATETIME,
    "realised" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "PseUserPreparatoryWork_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PseUserPreparatoryWork_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "PseFormation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PseUserPreparatoryWork_pseModuleId_fkey" FOREIGN KEY ("pseModuleId") REFERENCES "PseModule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PseUserPreparatoryWork" ("createdAt", "formationId", "id", "openingDate", "pseModuleId", "realised", "realisedDate", "updatedAt", "userId") SELECT "createdAt", "formationId", "id", "openingDate", "pseModuleId", "realised", "realisedDate", "updatedAt", "userId" FROM "PseUserPreparatoryWork";
DROP TABLE "PseUserPreparatoryWork";
ALTER TABLE "new_PseUserPreparatoryWork" RENAME TO "PseUserPreparatoryWork";
CREATE UNIQUE INDEX "PseUserPreparatoryWork_userId_formationId_pseModuleId_key" ON "PseUserPreparatoryWork"("userId", "formationId", "pseModuleId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
