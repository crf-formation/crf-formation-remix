import { AutocompleteInput, FunctionField, ReferenceField, ReferenceInput } from "react-admin";
import type { PlaceDto } from "~/dto/place.dto";

interface Props {
  source: string;
}

export function PlaceReferenceField({ source }: Props) {
  return (
    <ReferenceField label="Place" reference="place" source={source} fullWidth>
      <FunctionField render={(place: PlaceDto) => place && `${place.title}`} />
    </ReferenceField>
  );
}


export function PlaceReferenceInput({ source }: Props) {
  return (
    <ReferenceInput reference="place" source={source} fullWidth>
      <AutocompleteInput
        fullWidth
        optionText={(place) =>
          place == null ? "not defined" : place.title
        }
      />
    </ReferenceInput>
  );
}