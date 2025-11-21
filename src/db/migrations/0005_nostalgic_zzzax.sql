CREATE TABLE IF NOT EXISTS "patient" (
	"id" text PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text NOT NULL,
	"cpf" text NOT NULL,
	"birth_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "patient_email_unique" UNIQUE("email"),
	CONSTRAINT "patient_cpf_unique" UNIQUE("cpf")
);
