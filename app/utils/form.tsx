import type { FormResult } from "~/constants/types";

export function isAriaInvalid(actionData: FormResult | any, name: string): boolean | undefined {
	return actionData && actionData.errors && actionData?.errors[name] ? true : undefined
}

export function ariaDescribedby(name: string): string {
	return `${name}-form-error`
}

export function generateAria(actionData: FormResult | any, name: string) {
  return {
    "aria-invalid": isAriaInvalid(actionData, name),
    "aria-describedby": ariaDescribedby(name),
  };
}

export function generateAria2(error?: any, name: string) {
  return {
    "aria-invalid": !!error,
    "aria-describedby": ariaDescribedby(name),
  };
}