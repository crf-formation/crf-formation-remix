-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" TEXT NOT NULL DEFAULT 'CREATED',
    "role" TEXT NOT NULL DEFAULT 'USER',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Password" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserPasswordToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "tokenExpirationDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserPasswordToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PseFormation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "from" DATETIME NOT NULL,
    "to" DATETIME NOT NULL,
    "placeId" TEXT NOT NULL,
    CONSTRAINT "PseFormation_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PseModule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserOnPseFormation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserOnPseFormation_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "PseFormation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserOnPseFormation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PseUserPreparatoryWork" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "formationId" TEXT NOT NULL,
    "pseModuleId" TEXT NOT NULL,
    "openingDate" DATETIME NOT NULL,
    "realisedDate" DATETIME NOT NULL,
    "realised" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "PseUserPreparatoryWork_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PseUserPreparatoryWork_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "PseFormation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PseUserPreparatoryWork_pseModuleId_fkey" FOREIGN KEY ("pseModuleId") REFERENCES "PseModule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPasswordToken_userId_key" ON "UserPasswordToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPasswordToken_token_key" ON "UserPasswordToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PseModule_moduleId_key" ON "PseModule"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserOnPseFormation_formationId_userId_key" ON "UserOnPseFormation"("formationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PseUserPreparatoryWork_userId_formationId_pseModuleId_key" ON "PseUserPreparatoryWork"("userId", "formationId", "pseModuleId");
