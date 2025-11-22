ALTER TABLE "procedure_category" RENAME TO "categoria_procedimento";--> statement-breakpoint
ALTER TABLE "categoria_procedimento" DROP CONSTRAINT "procedure_category_nome_unique";--> statement-breakpoint
ALTER TABLE "procedimento" DROP CONSTRAINT "procedimento_categoria_id_procedure_category_id_fk";
--> statement-breakpoint
ALTER TABLE "procedimento" ADD CONSTRAINT "procedimento_categoria_id_categoria_procedimento_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categoria_procedimento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categoria_procedimento" ADD CONSTRAINT "categoria_procedimento_nome_unique" UNIQUE("nome");