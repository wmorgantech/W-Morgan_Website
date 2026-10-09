UPDATE "SiteSetting"
SET "value" = 'info@wmorgantechnologies.com'
WHERE "key" = 'contactEmail'
  AND "value" = 'info@wmorgantech.com';

UPDATE "SiteSetting"
SET "value" = '+91 98765 43210'
WHERE "key" = 'contactPhone'
  AND "value" IN ('+91 88707 05554', '+91 +91 88707 05554');
