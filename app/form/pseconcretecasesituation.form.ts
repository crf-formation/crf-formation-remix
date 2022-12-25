import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { z } from "zod";

//
// Put
//

export const PseConcreteCaseSituationPutSchema = z.object({
	pseConcreteCaseTypeId: z.string(),
	teacherId: z.string(),
  // pseSituationConcreteCaseGroups: zfd.repeatable(z.object({
  //   id: z.string().optional(),
  //   pseConcreteCaseGroupId: z.string(),
  //   position: z.number(),
  // }))
});

export const pseConcreteCaseSituationPutDtoValidator = withZod(PseConcreteCaseSituationPutSchema)

//
// Post
//

export const PseConcreteCaseSituationPostSchema = z.object({
  pseConcreteCaseSessionId: z.string(),
	pseConcreteCaseTypeId: z.string(),
	teacherId: z.string(),
  pseSituationConcreteCaseGroups: zfd.repeatable(z.object({
    id: z.string().optional(),
    pseConcreteCaseGroupId: z.string(),
    position: z.number(),
  }))
});

export const pseConcreteCaseSituationPostDtoValidator = withZod(PseConcreteCaseSituationPostSchema)
