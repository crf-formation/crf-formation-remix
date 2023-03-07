import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import type { DailyPostDto } from "~/dto/daily.dto";

export const DailySchema: z.ZodType<DailyPostDto> = z.object({
	title: z.string(),
	content: z.string(),
});

export const dailyValidator = withZod(DailySchema)