-- Corrects migration 20261009124500_update_public_contact_details, which replaced
-- the official contact details with a dummy phone number and a different email
-- domain on databases where it ran against saved values. The official details are
-- info@wmorgantech.com and +91 88707 05554.
--
-- Targeted and idempotent: only rows that still hold exactly the incorrect values
-- written by that migration are changed. Any other saved value is left alone, and
-- databases with no saved contact settings are unaffected.
UPDATE "SiteSetting"
SET "value" = 'info@wmorgantech.com'
WHERE "key" = 'contactEmail'
  AND "value" = 'info@wmorgantechnologies.com';

UPDATE "SiteSetting"
SET "value" = '+91 88707 05554'
WHERE "key" = 'contactPhone'
  AND "value" = '+91 98765 43210';
