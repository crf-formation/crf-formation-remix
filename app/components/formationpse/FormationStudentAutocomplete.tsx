import { TextField } from "@mui/material";
import { useState } from "react";
import UserAutocompleteResource from "~/routes/resource/formation-student-autocomplete";
import Autocomplete from "@mui/material/Autocomplete";
import type { UserDto } from "../../dto/user.dto";

interface Props {
  formationId: string;
  name?: string;
  defaultValue?: Array<string>;
}

function Content({ usersPaginateObject, isLoading, name, defaultValue, query, setQuery }) {
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
      />
      {selectedUsers.map((user: UserDto) => (
        <input key={user.id} type="hidden" name={`${name}`} value={user.id} />
      ))}
    </>
  );
}

export default function FormationUserAutocomplete({
  formationId,
  name = "students",
  defaultValue,
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
          />
        )
      }
    </UserAutocompleteResource>
  );
}
