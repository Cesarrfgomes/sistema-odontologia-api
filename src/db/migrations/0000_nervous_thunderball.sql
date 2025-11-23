CREATE TYPE "public"."status_pagamento" AS ENUM('PENDENTE', 'PAGO');--> statement-breakpoint
CREATE TYPE "public"."status_agendamento" AS ENUM('PENDENTE', 'CONFIRMADO', 'CANCELADO', 'COMPLETO');--> statement-breakpoint
CREATE TYPE "public"."tipo_pagamento" AS ENUM('VV', 'VP');--> statement-breakpoint
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
CREATE TABLE "departamento" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "departamento_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nome" text NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipamento" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "equipamento_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"descricao" text NOT NULL,
	"codigo_barras" text NOT NULL,
	"fornecedor_id" integer,
	"departamento_id" integer,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "equipamento_codigo_barras_unique" UNIQUE("codigo_barras")
);
--> statement-breakpoint
CREATE TABLE "entrada_material" (
	"txid" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "entrada_material_txid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"equipamento_id" integer NOT NULL,
	"fornecedor_id" integer NOT NULL,
	"quantidade" integer NOT NULL,
	"data_entrada" timestamp DEFAULT now() NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paciente" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"telefone" text NOT NULL,
	"cpf" text NOT NULL,
	"data_nascimento" date NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "paciente_email_unique" UNIQUE("email"),
	CONSTRAINT "paciente_cpf_unique" UNIQUE("cpf")
);
--> statement-breakpoint
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
CREATE TABLE "plano_pagamento_cobranca" (
	"plano_pagamento_id" text NOT NULL,
	"cobranca_id" text NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "plano_pagamento_cobranca_plano_pagamento_id_cobranca_id_pk" PRIMARY KEY("plano_pagamento_id","cobranca_id")
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
CREATE TABLE "categoria_procedimento" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categoria_procedimento_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
CREATE TABLE "procedimento" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"descricao" text NOT NULL,
	"categoria_id" text NOT NULL,
	"valor" numeric(10, 2) NOT NULL,
	"duracao_em_minutos" integer NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
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
CREATE TABLE "estoque" (
	"equipamento_id" integer NOT NULL,
	"qt" integer DEFAULT 0 NOT NULL,
	"qt_minima" integer DEFAULT 0 NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "estoque_equipamento_id_pk" PRIMARY KEY("equipamento_id")
);
--> statement-breakpoint
CREATE TABLE "fornecedor" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "fornecedor_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"fornecedor" text NOT NULL,
	"email" text NOT NULL,
	"telefone" text NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "fornecedor_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "usuario" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"senha" text NOT NULL,
	"funcao_id" integer NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usuario_username_unique" UNIQUE("username"),
	CONSTRAINT "usuario_email_unique" UNIQUE("email")
);
--> statement-breakpoint
INSERT INTO "usuario" ("id", "username", "nome", "email", "senha", "funcao_id", "ativo", "criado_em") VALUES (gen_random_uuid()::text, 'admin', 'Administrador', 'admin@admin.com', '$2b$10$0GraugPWYM/VqsIslwB9XuoDcmHBK.Q8uod81FJO0AixjRC6PIOqy', (SELECT "id" FROM "funcao" WHERE "nome" = 'admin'), true, now());--> statement-breakpoint
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_paciente_id_paciente_id_fk" FOREIGN KEY ("paciente_id") REFERENCES "public"."paciente"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_procedimento_id_procedimento_id_fk" FOREIGN KEY ("procedimento_id") REFERENCES "public"."procedimento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_usuario_id_usuario_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuario"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_medico_id_usuario_id_fk" FOREIGN KEY ("medico_id") REFERENCES "public"."usuario"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamento_equipamento" ADD CONSTRAINT "agendamento_equipamento_agendamento_id_agendamento_id_fk" FOREIGN KEY ("agendamento_id") REFERENCES "public"."agendamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamento_equipamento" ADD CONSTRAINT "agendamento_equipamento_equipamento_id_equipamento_id_fk" FOREIGN KEY ("equipamento_id") REFERENCES "public"."equipamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamento_pagamento" ADD CONSTRAINT "agendamento_pagamento_agendamento_id_agendamento_id_fk" FOREIGN KEY ("agendamento_id") REFERENCES "public"."agendamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamento_pagamento" ADD CONSTRAINT "agendamento_pagamento_pagamento_id_cobranca_id_fk" FOREIGN KEY ("pagamento_id") REFERENCES "public"."cobranca"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamento_pagamento" ADD CONSTRAINT "agendamento_pagamento_plano_pagamento_id_plano_pagamento_id_fk" FOREIGN KEY ("plano_pagamento_id") REFERENCES "public"."plano_pagamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipamento" ADD CONSTRAINT "equipamento_fornecedor_id_fornecedor_id_fk" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fornecedor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipamento" ADD CONSTRAINT "equipamento_departamento_id_departamento_id_fk" FOREIGN KEY ("departamento_id") REFERENCES "public"."departamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entrada_material" ADD CONSTRAINT "entrada_material_equipamento_id_equipamento_id_fk" FOREIGN KEY ("equipamento_id") REFERENCES "public"."equipamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entrada_material" ADD CONSTRAINT "entrada_material_fornecedor_id_fornecedor_id_fk" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fornecedor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plano_pagamento_cobranca" ADD CONSTRAINT "plano_pagamento_cobranca_plano_pagamento_id_plano_pagamento_id_fk" FOREIGN KEY ("plano_pagamento_id") REFERENCES "public"."plano_pagamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plano_pagamento_cobranca" ADD CONSTRAINT "plano_pagamento_cobranca_cobranca_id_cobranca_id_fk" FOREIGN KEY ("cobranca_id") REFERENCES "public"."cobranca"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "procedimento" ADD CONSTRAINT "procedimento_categoria_id_categoria_procedimento_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categoria_procedimento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funcao" ADD CONSTRAINT "funcao_perfil_id_perfil_id_fk" FOREIGN KEY ("perfil_id") REFERENCES "public"."perfil"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estoque" ADD CONSTRAINT "estoque_equipamento_id_equipamento_id_fk" FOREIGN KEY ("equipamento_id") REFERENCES "public"."equipamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_funcao_id_funcao_id_fk" FOREIGN KEY ("funcao_id") REFERENCES "public"."funcao"("id") ON DELETE no action ON UPDATE no action;
