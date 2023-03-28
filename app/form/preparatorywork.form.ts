import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import type { FormArrayWrapperDto } from "~/dto/form.dto";
import type { PseUserPreparatoryWorkPostDto } from "~/dto/pseuserpreparatorywork.dto";

const PseUserPreparatoryWorkPostSchema: z.ZodType<
  FormArrayWrapperDto<Omit<PseUserPreparatoryWorkPostDto, "pseModuleName">>
> = z.object({
  array: zfd.json(
    z.array(
      zfd.json(
        z.object({
          pseModuleId: z.string(),
          realised: z.boolean(),
          openingDate: z.string().nullish(),
          realisedDate: z.string().nullish(),
        })
      )
    )
  ),
});

export const pseUserPreparatoryWorkValidator = withZod(PseUserPreparatoryWorkPostSchema)