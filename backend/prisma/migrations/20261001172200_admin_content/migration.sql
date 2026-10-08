ALTER TABLE "Service"
ADD COLUMN "features" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "features" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_isActive_idx" ON "Product"("isActive");
CREATE INDEX "Product_sortOrder_idx" ON "Product"("sortOrder");

CREATE TABLE "SiteSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);

ALTER TABLE "Project"
ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "ContactInquiry"
ADD COLUMN "service" TEXT;

ALTER TABLE "JobOpening"
ADD COLUMN "department" TEXT,
ADD COLUMN "experience" TEXT,
ADD COLUMN "skills" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
