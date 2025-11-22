CREATE TYPE "public"."procedure_status" AS ENUM('ativo', 'inativo');--> statement-breakpoint
CREATE TYPE "public"."papel" AS ENUM('basico', 'admin', 'medico');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('ativo', 'inativo');--> statement-breakpoint
CREATE TABLE "paciente" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"telefone" text NOT NULL,
	"cpf" text NOT NULL,
	"data_nascimento" date NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"atualizado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "paciente_email_unique" UNIQUE("email"),
	CONSTRAINT "paciente_cpf_unique" UNIQUE("cpf")
);
--> statement-breakpoint
CREATE TABLE "procedure_category" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "procedure_category_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
CREATE TABLE "procedimento" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"descricao" text NOT NULL,
	"categoria_id" text NOT NULL,
	"valor" numeric(10, 2) NOT NULL,
	"duracao_em_minutos" integer NOT NULL,
	"status" "procedure_status" DEFAULT 'ativo' NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuario" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"senha" text NOT NULL,
	"role" "papel" DEFAULT 'basico' NOT NULL,
	"status" "status" DEFAULT 'ativo' NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usuario_username_unique" UNIQUE("username"),
	CONSTRAINT "usuario_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "procedimento" ADD CONSTRAINT "procedimento_categoria_id_procedure_category_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."procedure_category"("id") ON DELETE no action ON UPDATE no action;