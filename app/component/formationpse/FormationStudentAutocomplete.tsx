import { TextField } from "@mui/material";
import { useState } from "react";
import UserAutocompleteResource from "~/routes/resource/formation-student-autocomplete";
import type { AutocompleteProps } from "@mui/material/Autocomplete";
import Autocomplete from "@mui/material/Autocomplete";
import type { UserDto } from "~/dto/user.dto";

interface Props extends AutocompleteProps {
  formationId: string;
  name?: string;
  defaultValue?: Array<any>;
}

function Content({ usersPaginateObject, isLoading, name, defaultValue, query, setQuery, ...otherProps }) {
  const [selectedUsers, setSelectedUsers] = useState<Array<UserDto>>(defaultValue || []);

  return (
    <>
      {/* TODO: handle isLoading */}
      <Autocomplete
        disablePortal
        multiple
        fullWidth
        value={selectedUsers}
        onChange={(e, selectedOptions) => setSelectedUsers(selectedOptions)}
        getOptionLabel={(option) => option.fullName}
        options={usersPaginateObject?.data || []}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Participants"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
        {...otherProps}
      />
      {selectedUsers.map((user: UserDto) => (
        <input key={user.id} type="hidden" name={`${name}`} value={user.id} />
      ))}
    </>
  );
}

export default function FormationStudentAutocomplete(
  {
    formationId,
    name = "students",
    defaultValue,
    ...otherProps
  }: Props) {
  const [query, setQuery] = useState("");

  return (
    <UserAutocompleteResource query={query} formationId={formationId}>
      {({ usersPaginateObject, isLoading }) =>
        isLoading ? (
          // TODO: loading
          <span />
        ) : (
          <Content
            usersPaginateObject={usersPaginateObject}
            isLoading={isLoading}
            name={name}
            query={query}
            setQuery={setQuery}
            defaultValue={defaultValue}
            {...otherProps}
          />
        )
      }
    </UserAutocompleteResource>
  );
}
