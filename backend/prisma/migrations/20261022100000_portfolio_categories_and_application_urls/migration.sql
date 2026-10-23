-- Add managed portfolio categories and their project assignments without changing
-- existing project tags, uploaded images, or products.
CREATE TABLE "PortfolioCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PortfolioCategory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PortfolioCategory_slug_key" ON "PortfolioCategory"("slug");
CREATE INDEX "PortfolioCategory_isActive_idx" ON "PortfolioCategory"("isActive");
CREATE INDEX "PortfolioCategory_sortOrder_idx" ON "PortfolioCategory"("sortOrder");

CREATE TABLE "_PortfolioCategoryToProject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PortfolioCategoryToProject_AB_pkey" PRIMARY KEY ("A", "B")
);

CREATE INDEX "_PortfolioCategoryToProject_B_index"
    ON "_PortfolioCategoryToProject"("B");

ALTER TABLE "_PortfolioCategoryToProject"
    ADD CONSTRAINT "_PortfolioCategoryToProject_A_fkey"
    FOREIGN KEY ("A") REFERENCES "PortfolioCategory"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_PortfolioCategoryToProject"
    ADD CONSTRAINT "_PortfolioCategoryToProject_B_fkey"
    FOREIGN KEY ("B") REFERENCES "Project"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed the categories already used by the admin form and migrate existing
-- matching project tags into relational assignments.
INSERT INTO "PortfolioCategory" ("name", "slug", "sortOrder", "updatedAt")
VALUES
    ('Web Development', 'web-development', 1, CURRENT_TIMESTAMP),
    ('E-Commerce', 'e-commerce', 2, CURRENT_TIMESTAMP),
    ('CRM', 'crm', 3, CURRENT_TIMESTAMP),
    ('Mobile Apps', 'mobile-apps', 4, CURRENT_TIMESTAMP),
    ('UI/UX Design', 'ui-ux-design', 5, CURRENT_TIMESTAMP),
    ('Custom Software', 'custom-software', 6, CURRENT_TIMESTAMP),
    ('Cloud Solutions', 'cloud-solutions', 7, CURRENT_TIMESTAMP);

INSERT INTO "_PortfolioCategoryToProject" ("A", "B")
SELECT DISTINCT category."id", project."id"
FROM "Project" AS project
CROSS JOIN LATERAL unnest(project."tags") AS project_tag(tag)
JOIN "PortfolioCategory" AS category
    ON category."name" = CASE lower(btrim(project_tag.tag))
        WHEN 'website' THEN 'Web Development'
        WHEN 'web design' THEN 'Web Development'
        WHEN 'business website' THEN 'Web Development'
        WHEN 'ecommerce' THEN 'E-Commerce'
        WHEN 'e commerce' THEN 'E-Commerce'
        WHEN 'online store' THEN 'E-Commerce'
        WHEN 'customer relationship management' THEN 'CRM'
        WHEN 'mobile app' THEN 'Mobile Apps'
        WHEN 'mobile' THEN 'Mobile Apps'
        WHEN 'android' THEN 'Mobile Apps'
        WHEN 'ios' THEN 'Mobile Apps'
        WHEN 'ui/ux design' THEN 'UI/UX Design'
        WHEN 'ui/ux' THEN 'UI/UX Design'
        WHEN 'ui' THEN 'UI/UX Design'
        WHEN 'ux' THEN 'UI/UX Design'
        WHEN 'ui ux' THEN 'UI/UX Design'
        WHEN 'product design' THEN 'UI/UX Design'
        WHEN 'software development' THEN 'Custom Software'
        WHEN 'enterprise software' THEN 'Custom Software'
        WHEN 'cloud' THEN 'Cloud Solutions'
        WHEN 'devops' THEN 'Cloud Solutions'
        ELSE initcap(btrim(project_tag.tag))
    END;

ALTER TABLE "JobApplication" ADD COLUMN "portfolioUrl" TEXT;
