import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { PseConcreteCaseSessionStateDtoZEnum } from "~/dto/pseconcretecasesession.dto";

//
// Put
//

export const PseConcreteCaseSessionPutSchema = z.object({
	name: z.string(),
	state: PseConcreteCaseSessionStateDtoZEnum,
});

export const pseConcreteCaseSessionPutDtoValidator = withZod(PseConcreteCaseSessionPutSchema)

//
// Post
//

export const PseConcreteCaseSessionPostSchema = z.object({
  formationId: z.string(),
	name: z.string(),
});

export const pseConcreteCaseSessionPostDtoValidator = withZod(PseConcreteCaseSessionPostSchema)
