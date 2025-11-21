CREATE TYPE "public"."role" AS ENUM('basic', 'admin');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "role" DEFAULT 'basic' NOT NULL;