-- Testimonials: a quote is no longer mandatory (a client can be recorded before
-- their words are available) and a client location can be stored.
ALTER TABLE "Testimonial" ALTER COLUMN "quote" DROP NOT NULL;
ALTER TABLE "Testimonial" ADD COLUMN "location" TEXT;

-- Initial client details supplied by the business. They have NO quote and are
-- left unpublished ("featured" = false) so nothing is shown on the public
-- website until a real quote is added and the record is published in Admin.
INSERT INTO "Testimonial" ("authorName", "location", "featured", "sortOrder", "updatedAt")
SELECT 'Mr. Karthick Lakshmanan', 'Coimbatore', false, 1, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "Testimonial"
  WHERE "authorName" = 'Mr. Karthick Lakshmanan' AND "location" = 'Coimbatore'
);

INSERT INTO "Testimonial" ("authorName", "location", "featured", "sortOrder", "updatedAt")
SELECT 'Mr. Balaji', 'Coimbatore', false, 2, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM "Testimonial"
  WHERE "authorName" = 'Mr. Balaji' AND "location" = 'Coimbatore'
);

-- The Tamilvelan Astrology product image was saved as a path on a local
-- computer, which can never load for visitors. Point it at the project asset
-- (frontend/public/images/products/tamilvelan-astrology.png). Only rows that
-- still hold the invalid local path are touched.
UPDATE "Product"
SET "imageUrl" = '/images/products/tamilvelan-astrology.png'
WHERE "slug" = 'tamilvelan-astrology'
  AND "imageUrl" LIKE '%om logo.png%';
