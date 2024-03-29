interface Props {
  name: string;
  json: any;
}

/**
 * Display a json object as input hidden fields.
 *
 * Note: use zfd on your zod schema to describe the expected json data.
 */
export default function InputHiddenJson({ name, json }: Props) {
  return (
    <input type="hidden" name={name} value={JSON.stringify(json)} />
  );
}