import type { RefObject } from "react";
import { useEffect } from "react";
import type { InvalidFormResultDto } from "../dto/form.dto";

type ReferenceData = [string, RefObject<HTMLElement>]
type ReferenceArray = Array<ReferenceData>

export default function useFormFocusError(actionData: InvalidFormResultDto | any, references: ReferenceArray) {
  useEffect(() => {
    const refDataToFocus: ReferenceData | undefined = references.find((refData: ReferenceData) => {
      const name = refData[0];
      return actionData && actionData.errors && actionData?.errors[name];
    });

    if (refDataToFocus) {
      const ref = refDataToFocus[1];
      ref?.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);
}