import type { RefObject } from "react";
import { useEffect } from 'react';
import type { FormResult } from "~/constant/types";

export default function useFormFocusError(actionData: FormResult | any, references: Array<[string, RefObject<any> ]>) {
	useEffect(() => {
		const refDataToFocus = references.some((refData: [string, RefObject<any> ]) => {
			const name = refData[0]
			return actionData && actionData.errors && actionData?.errors[name]
		})

		if (refDataToFocus) {
			const ref = refDataToFocus[1]
			ref?.focus()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ actionData ])
}