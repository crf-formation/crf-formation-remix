import TextField from "@mui/material/TextField";
import { useState } from "react";
import UserAutocompleteResource from "~/routes/resource/formation-teacher-autocomplete";
import type { AutocompleteProps } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import type { UserDto } from "~/dto/user.dto";

interface Props extends AutocompleteProps {
  formationId: string;
  name?: string;
  defaultValue?: UserDto | Array<UserDto>;
}

function ContentMultiple(
  {
    usersPaginateObject,
    isLoading,
    name = "teachers",
    defaultValue,
    query,
    setQuery,
    ...otherProps
  }) {
  const [selectedUsers, setSelectedUsers] = useState<Array<UserDto>>(defaultValue || []);

  return (
    <>
      {/* TODO: handle isLoading */}
      <Autocomplete
        disablePortal
        fullWidth
        multiple
        value={selectedUsers}
        onChange={(e, selectedOptions) => setSelectedUsers(selectedOptions)}
        getOptionLabel={(option) => option.fullName}
        options={usersPaginateObject?.data || []}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Formateurs"
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


function ContentSingle(
  {
    usersPaginateObject,
    isLoading,
    name = "teacher",
    defaultValue,
    query,
    setQuery,
    ...otherProps
  }) {
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(defaultValue || null);

  return (
    <>
      {/* TODO: handle isLoading */}
      <Autocomplete
        disablePortal
        fullWidth
        multiple={false}
        value={selectedUser}
        onChange={(e, selectedOption) => setSelectedUser(selectedOption)}
        getOptionLabel={(option) => option.fullName}
        options={usersPaginateObject?.data || []}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Formateur"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
        {...otherProps}
      />
      {selectedUser && (
        <input key={selectedUser.id} type="hidden" name={`${name}`} value={selectedUser.id} />
      )}
    </>
  );
}

export default function FormationTeacherAutocomplete(
  {
    formationId,
    name,
    multiple,
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
        ) : multiple ? (
          <ContentMultiple
            usersPaginateObject={usersPaginateObject}
            isLoading={isLoading}
            name={name}
            query={query}
            setQuery={setQuery}
            defaultValue={defaultValue}
            {...otherProps}
          />
        ) : (
          <ContentSingle
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
