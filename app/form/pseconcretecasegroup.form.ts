import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

//
// Put
//

export const PseConcreteCaseGroupPutSchema = z.object({
	name: z.string(),
  students: z.array(z.string())
});

export const pseConcreteCaseGroupPutDtoValidator = withZod(PseConcreteCaseGroupPutSchema)

//
// Post
//

export const PseConcreteCaseGroupPostSchema = z.object({
	pseConcreteCaseSessionId: z.string(),
	name: z.string(),
  students: z.array(z.string()) 
});

export const pseConcreteCaseGroupPostDtoValidator = withZod(PseConcreteCaseGroupPostSchema)
