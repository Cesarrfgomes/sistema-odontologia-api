ALTER TABLE "usuario" RENAME COLUMN "perfil_id" TO "funcao_id";--> statement-breakpoint
ALTER TABLE "usuario" DROP CONSTRAINT "usuario_perfil_id_perfil_id_fk";
--> statement-breakpoint
ALTER TABLE "agendamento" ALTER COLUMN "procedimento_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "agendamento" ALTER COLUMN "usuario_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "agendamento" ALTER COLUMN "medico_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "agendamento_pagamento" ALTER COLUMN "pagamento_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "agendamento_pagamento" ALTER COLUMN "plano_pagamento_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_funcao_id_funcao_id_fk" FOREIGN KEY ("funcao_id") REFERENCES "public"."funcao"("id") ON DELETE no action ON UPDATE no action;