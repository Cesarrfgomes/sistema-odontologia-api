CREATE TYPE "public"."status_pagamento" AS ENUM('PENDENTE', 'PAGO');--> statement-breakpoint
CREATE TYPE "public"."status_agendamento" AS ENUM('PENDENTE', 'CONFIRMADO', 'CANCELADO', 'COMPLETO');--> statement-breakpoint
CREATE TABLE "agendamento" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "agendamento_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"paciente_id" text NOT NULL,
	"procedimento_id" text NOT NULL,
	"data" date NOT NULL,
	"hora" time NOT NULL,
	"usuario_id" text NOT NULL,
	"medico_id" text NOT NULL,
	"status" "status_agendamento" DEFAULT 'PENDENTE' NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"atualizado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agendamento_equipamento" (
	"agendamento_id" integer,
	"equipamento_id" integer,
	"quantidade" integer NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"atualizado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agendamento_pagamento" (
	"agendamento_id" integer,
	"pagamento_id" text,
	"plano_pagamento_id" text,
	"status_pagamento" "status_pagamento" DEFAULT 'PENDENTE' NOT NULL,
	"valor" numeric NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"atualizado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "perfil" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "perfil_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nome" text NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "perfil_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
INSERT INTO "perfil" ("nome", "ativo", "criado_em") VALUES ('basico', true, now());--> statement-breakpoint
INSERT INTO "perfil" ("nome", "ativo", "criado_em") VALUES ('admin', true, now());--> statement-breakpoint
CREATE TABLE "funcao" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "funcao_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nome" text NOT NULL,
	"perfil_id" integer NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "funcao" ("nome", "perfil_id", "criado_em") VALUES ('admin', (SELECT "id" FROM "perfil" WHERE "nome" = 'admin'), now());
--> statement-breakpoint
ALTER TABLE "usuario" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "usuario" ALTER COLUMN "role" TYPE integer USING 1;--> statement-breakpoint
ALTER TABLE "usuario" RENAME COLUMN "role" TO "perfil_id";--> statement-breakpoint
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_paciente_id_paciente_id_fk" FOREIGN KEY ("paciente_id") REFERENCES "public"."paciente"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_procedimento_id_procedimento_id_fk" FOREIGN KEY ("procedimento_id") REFERENCES "public"."procedimento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_usuario_id_usuario_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuario"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_medico_id_usuario_id_fk" FOREIGN KEY ("medico_id") REFERENCES "public"."usuario"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamento_equipamento" ADD CONSTRAINT "agendamento_equipamento_agendamento_id_agendamento_id_fk" FOREIGN KEY ("agendamento_id") REFERENCES "public"."agendamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamento_equipamento" ADD CONSTRAINT "agendamento_equipamento_equipamento_id_equpamento_id_fk" FOREIGN KEY ("equipamento_id") REFERENCES "public"."equpamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamento_pagamento" ADD CONSTRAINT "agendamento_pagamento_agendamento_id_agendamento_id_fk" FOREIGN KEY ("agendamento_id") REFERENCES "public"."agendamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamento_pagamento" ADD CONSTRAINT "agendamento_pagamento_pagamento_id_cobranca_id_fk" FOREIGN KEY ("pagamento_id") REFERENCES "public"."cobranca"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamento_pagamento" ADD CONSTRAINT "agendamento_pagamento_plano_pagamento_id_plano_pagamento_id_fk" FOREIGN KEY ("plano_pagamento_id") REFERENCES "public"."plano_pagamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funcao" ADD CONSTRAINT "funcao_perfil_id_perfil_id_fk" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfil"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_perfil_id_perfil_id_fk" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfil"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."papel";
