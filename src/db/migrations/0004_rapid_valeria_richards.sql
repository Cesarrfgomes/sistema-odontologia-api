CREATE TABLE "departamento" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "departamento_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nome" text NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equpamento" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "equpamento_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"descricao" text NOT NULL,
	"codigo_barras" text NOT NULL,
	"fornecedor_id" integer,
	"departamento_id" integer,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "equpamento_codigo_barras_unique" UNIQUE("codigo_barras")
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
ALTER TABLE "equpamento" ADD CONSTRAINT "equpamento_fornecedor_id_fornecedor_id_fk" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fornecedor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equpamento" ADD CONSTRAINT "equpamento_departamento_id_departamento_id_fk" FOREIGN KEY ("departamento_id") REFERENCES "public"."departamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entrada_material" ADD CONSTRAINT "entrada_material_equipamento_id_equpamento_id_fk" FOREIGN KEY ("equipamento_id") REFERENCES "public"."equpamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entrada_material" ADD CONSTRAINT "entrada_material_fornecedor_id_fornecedor_id_fk" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fornecedor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estoque" ADD CONSTRAINT "estoque_equipamento_id_equpamento_id_fk" FOREIGN KEY ("equipamento_id") REFERENCES "public"."equpamento"("id") ON DELETE no action ON UPDATE no action;