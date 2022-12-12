import { FunctionField, ReferenceField, ReferenceInput, AutocompleteInput } from 'react-admin';
import type { UserDto } from '~/dto/user.dto';

interface Props {
  source: string
}

export function UserReferenceField({ source }: Props) {
	return (
    <ReferenceField label="User" reference="user" source={source} fullWidth>
       <FunctionField render={(user: UserDto) => user && `${user.firstName} ${user.lastName}`} />
    </ReferenceField>
  );
}

export function UserReferenceInput({ source }: Props) {
	return (
    <ReferenceInput reference="user" source={source} fullWidth>
      <AutocompleteInput
				fullWidth
        optionText={(user) =>
          user == null ? "not defined" : `${user.firstName} ${user.lastName}`
        }
      />
    </ReferenceInput>
  );
}