import InputHiddenJson from "./InputHiddenJson"

interface Props {
  name: string;
  array: Array<any>
}

/**
 * Display a json array as input hidden fields.
 */
export default function InputHiddenJsonArray({ name, array }: Props) {

  return (
    <>
      {array.map((obj, index) => (
        <InputHiddenJson
          key={index}
          namePrefix={`${name}[${index}].`}
          json={obj}
        />
      ))}
    </>
  );
}