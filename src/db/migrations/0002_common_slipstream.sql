CREATE TYPE "public"."tipo_pagamento" AS ENUM('VV', 'VP');--> statement-breakpoint
CREATE TABLE "cobranca" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"parcelas_maximas" integer DEFAULT 1 NOT NULL,
	"prazo_maximo" integer DEFAULT 30 NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cobranca_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
CREATE TABLE "plano_pagamento" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"parcelas_maximas" integer DEFAULT 1 NOT NULL,
	"prazo_maximo" integer DEFAULT 30 NOT NULL,
	"payment_type" "tipo_pagamento" NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "plano_pagamento_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
ALTER TABLE "paciente" DROP COLUMN "atualizado_em";--> statement-breakpoint
ALTER TABLE "paciente" ADD COLUMN "ativo" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "procedimento" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "procedimento" ADD COLUMN "ativo" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "usuario" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "usuario" ADD COLUMN "ativo" boolean DEFAULT true NOT NULL;--> statement-breakpoint
DROP TYPE "public"."procedure_status";--> statement-breakpoint
DROP TYPE "public"."status";
