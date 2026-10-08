ALTER TABLE "JobApplication"
DROP CONSTRAINT "JobApplication_jobOpeningId_fkey";

ALTER TABLE "JobApplication"
ADD CONSTRAINT "JobApplication_jobOpeningId_fkey"
FOREIGN KEY ("jobOpeningId")
REFERENCES "JobOpening"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
