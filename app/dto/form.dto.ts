export interface InvalidFormResultDto {
  fieldErrors?: { [key: string]: any };
}


/**
 * On html form-data, we cannot easily directly have an array on forms.
 * We must use a wrapper.
 */
export interface FormArrayWrapperDto<T> {
  array: Array<T>;
}
