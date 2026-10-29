-- CreateTable
CREATE TABLE "TripRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "destination" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "flexibleDates" BOOLEAN NOT NULL DEFAULT false,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "babies" INTEGER NOT NULL DEFAULT 0,
    "budgetLevel" TEXT NOT NULL DEFAULT 'confort',
    "budgetAmount" INTEGER NOT NULL DEFAULT 700,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "interests" TEXT NOT NULL DEFAULT '[]',
    "rhythm" TEXT NOT NULL DEFAULT 'equilibre',
    "dietary" TEXT,
    "accommodation" TEXT,
    "transport" TEXT,
    "notes" TEXT,
    "firstName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "plan" TEXT NOT NULL DEFAULT 'premium',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "locale" TEXT NOT NULL DEFAULT 'fr',
    "stripeSessionId" TEXT,
    "paymentIntentId" TEXT,
    "generationAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT
);

-- CreateTable
CREATE TABLE "Itinerary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripRequestId" TEXT NOT NULL,
    "json" TEXT NOT NULL,
    "pdf" BLOB,
    "modelUsed" TEXT NOT NULL,
    "tokensUsed" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Itinerary_tripRequestId_fkey" FOREIGN KEY ("tripRequestId") REFERENCES "TripRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripRequestId" TEXT NOT NULL,
    "resendId" TEXT,
    "status" TEXT NOT NULL,
    "subject" TEXT,
    "previewHtml" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailLog_tripRequestId_fkey" FOREIGN KEY ("tripRequestId") REFERENCES "TripRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MagicLinkToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "usedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "TripRequest_stripeSessionId_key" ON "TripRequest"("stripeSessionId");

-- CreateIndex
CREATE INDEX "TripRequest_email_idx" ON "TripRequest"("email");

-- CreateIndex
CREATE INDEX "TripRequest_status_idx" ON "TripRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Itinerary_tripRequestId_key" ON "Itinerary"("tripRequestId");

-- CreateIndex
CREATE INDEX "EmailLog_tripRequestId_idx" ON "EmailLog"("tripRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "MagicLinkToken_tokenHash_key" ON "MagicLinkToken"("tokenHash");

-- CreateIndex
CREATE INDEX "MagicLinkToken_email_idx" ON "MagicLinkToken"("email");
