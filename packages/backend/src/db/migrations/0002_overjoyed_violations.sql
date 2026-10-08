ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email" text DEFAULT '';
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;