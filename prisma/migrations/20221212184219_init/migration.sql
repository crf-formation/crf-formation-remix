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
CREATE TABLE "PseGlobalFormation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "from" DATETIME NOT NULL,
    "to" DATETIME NOT NULL,
    "placeId" TEXT NOT NULL,
    CONSTRAINT "PseGlobalFormation_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PseGlobalModule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserOnPseGlobalFormation" (
    "formationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("formationId", "userId"),
    CONSTRAINT "UserOnPseGlobalFormation_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "PseGlobalFormation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserOnPseGlobalFormation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PseGlobalUserPreparatoryWork" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "formationId" TEXT NOT NULL,
    "pseGlobalModuleId" TEXT NOT NULL,
    "openingDate" DATETIME NOT NULL,
    "realisedDate" DATETIME NOT NULL,
    "realised" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "PseGlobalUserPreparatoryWork_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PseGlobalUserPreparatoryWork_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "PseGlobalFormation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PseGlobalUserPreparatoryWork_pseGlobalModuleId_fkey" FOREIGN KEY ("pseGlobalModuleId") REFERENCES "PseGlobalModule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
CREATE UNIQUE INDEX "PseGlobalModule_moduleId_key" ON "PseGlobalModule"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "PseGlobalUserPreparatoryWork_userId_formationId_pseGlobalModuleId_key" ON "PseGlobalUserPreparatoryWork"("userId", "formationId", "pseGlobalModuleId");
