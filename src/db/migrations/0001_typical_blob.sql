CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "client" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "client" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "client" DROP COLUMN "updated_at";