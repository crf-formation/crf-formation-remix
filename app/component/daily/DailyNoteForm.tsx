import FormTextField from "~/component/form/FormTextField";
import FormView from "~/component/form/FormView";
import type { DailyNoteDto } from "~/dto/daily.dto";
import { dailyValidator } from "~/form/daily.form";


export default function DailyNoteForm({ daily }: { daily: DailyNoteDto }) {
  return (
    <FormView
      submitText="Mettre à jour"
      validator={dailyValidator}
    >
      <FormTextField
        defaultValue={daily.title}
        label="Titre"
        variant="filled"
        size="medium"
        fullWidth
      />

      <FormTextField
        defaultValue={daily.content}
        variant="filled"
        size="medium"
        fullWidth
        multiline
        rows={15}
      />
    </FormView>
  );
}