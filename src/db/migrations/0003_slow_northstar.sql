CREATE TYPE "public"."procedure_status" AS ENUM('ativo', 'inativo');--> statement-breakpoint
ALTER TYPE "public"."role" ADD VALUE 'doctor';--> statement-breakpoint
CREATE TABLE "procedure_category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "procedure_category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "procedure" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category_id" text NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"duration" text NOT NULL,
	"status" "procedure_status" DEFAULT 'ativo' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "procedure" ADD CONSTRAINT "procedure_category_id_procedure_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."procedure_category"("id") ON DELETE no action ON UPDATE no action;