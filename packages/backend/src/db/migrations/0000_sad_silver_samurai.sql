CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"notes_to_self" text DEFAULT '',
	"map_drawings" jsonb DEFAULT '[]',
	"theme_title" text DEFAULT 'Dream Diary',
	"theme_subtitle" text DEFAULT 'My memories and adventures',
	"theme_id" uuid,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "destinations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"country" text NOT NULL,
	"coordinates" jsonb NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL,
	"notes" text NOT NULL,
	"checklist" jsonb DEFAULT '[]' NOT NULL,
	"stickers" jsonb DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "themes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"creator_id" uuid,
	"base_color" text NOT NULL,
	"colors" jsonb NOT NULL,
	"color_hash" text NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "themes_color_hash_unique" UNIQUE("color_hash")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "destinations" ADD CONSTRAINT "destinations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "themes" ADD CONSTRAINT "themes_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;