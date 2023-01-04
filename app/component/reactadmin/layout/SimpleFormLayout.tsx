// https://marmelab.com/react-admin/Buttons.html#record-buttons

import { Box } from '@mui/material';
import type { SimpleFormProps as MuiSimpleFormProps, ToolbarProps } from 'react-admin';
import { DeleteWithConfirmButton, SaveButton, SimpleForm, Toolbar, useRecordContext } from 'react-admin';

function EditToolbar(props: ToolbarProps) {
	const record = useRecordContext();

	return (
    <Toolbar {...props}>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
        <SaveButton />
        <DeleteWithConfirmButton
          confirmContent="You will not be able to recover this record. Are you sure?"
          translateOptions={{ name: record.name }}
        />
      </Box>
    </Toolbar>
  );
}

function CreateToolbar(props: ToolbarProps) {
	return (
    <Toolbar {...props}>
     
    </Toolbar>
  );
}


interface SimpleFormProps extends MuiSimpleFormProps{
	variant: 'edit' | 'create'
}

export default function SimpleFormLayout({ variant, children, ...props }: SimpleFormProps) {
  return (
    <SimpleForm
      toolbar={variant === "edit" ? <EditToolbar /> : <CreateToolbar />}
      // https://stackoverflow.com/questions/71802390/only-send-data-that-has-form-inputs-in-edit
      sanitizeEmptyValues={false}
      {...props}
    >
      {children}
    </SimpleForm>
  );
}