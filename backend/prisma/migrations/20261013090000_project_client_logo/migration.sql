-- Optional client logo for portfolio projects (uploaded through Admin).
-- Adds one nullable column; existing projects and their cover images are untouched.
ALTER TABLE "Project" ADD COLUMN "clientLogo" TEXT;
