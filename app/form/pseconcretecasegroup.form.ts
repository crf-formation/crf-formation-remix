import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

//
// Put
//

export const PseConcreteCaseGroupPutSchema = z.object({
  name: z.string(),
  students: zfd.repeatableOfType(z.string())
    .optional() // optional to allow edit the students later
});

export const pseConcreteCaseGroupPutDtoValidator = withZod(PseConcreteCaseGroupPutSchema);

//
// Post
//

export const PseConcreteCaseGroupPostSchema = z.object({
  pseConcreteCaseSessionId: z.string(),
  name: z.string(),
  students: zfd.repeatableOfType(z.string())
    .optional() // optional to allow edit the students later
});

export const pseConcreteCaseGroupPostDtoValidator = withZod(PseConcreteCaseGroupPostSchema);
