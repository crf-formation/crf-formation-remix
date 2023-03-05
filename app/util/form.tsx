import type { InvalidInvalidFormResultDto } from "~/dto/form.dto";

export function isAriaInvalid(actionData: InvalidInvalidFormResultDto | any, name: string): boolean | undefined {
	return actionData && actionData.fieldErrors && actionData?.fieldErrors[name] ? true : undefined
}

export function ariaDescribedby(name: string): string {
	return `${name}-form-error`
}

export function generateAria(actionData: InvalidInvalidFormResultDto | any, name: string) {
  return {
    "aria-invalid": isAriaInvalid(actionData, name),
    "aria-describedby": ariaDescribedby(name),
  };
}

export function generateAria2(error: any, name: string) {
  return {
    "aria-invalid": !!error,
    "aria-describedby": ariaDescribedby(name),
  };
}