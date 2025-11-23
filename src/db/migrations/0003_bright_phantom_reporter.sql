CREATE TABLE "plano_pagamento_cobranca" (
	"plano_pagamento_id" text NOT NULL,
	"cobranca_id" text NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "plano_pagamento_cobranca_plano_pagamento_id_cobranca_id_pk" PRIMARY KEY("plano_pagamento_id","cobranca_id")
);
--> statement-breakpoint
ALTER TABLE "plano_pagamento_cobranca" ADD CONSTRAINT "plano_pagamento_cobranca_plano_pagamento_id_plano_pagamento_id_fk" FOREIGN KEY ("plano_pagamento_id") REFERENCES "public"."plano_pagamento"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plano_pagamento_cobranca" ADD CONSTRAINT "plano_pagamento_cobranca_cobranca_id_cobranca_id_fk" FOREIGN KEY ("cobranca_id") REFERENCES "public"."cobranca"("id") ON DELETE no action ON UPDATE no action;