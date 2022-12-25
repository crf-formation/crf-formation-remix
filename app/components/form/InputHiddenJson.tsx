
interface Props {
	namePrefix: string;
	json: any;
}

/**
 * Display a json object as input hidden fields.
 */
export default function InputHiddenJson({ namePrefix, json }: Props) {
  return (
    <>
      {Object.keys(json).map((key) => (
        <input
          type="hidden"
          key={key}
          name={`${namePrefix}${key}`}
          value={json[key]}
        />
      ))}
    </>
  );
}