import FormTextField from "~/component/form/FormTextField";
import FormView from "~/component/form/FormView";
import type { DailyNoteDto } from "~/dto/daily.dto";
import { dailyValidator } from "~/form/daily.form";


export default function DailyNoteForm({ daily }: { daily: DailyNoteDto }) {
  return (
    <FormView
      submitText="Mettre à jour" // TODO: when creating note specific label
      validator={dailyValidator}
    >
      <FormTextField
        name="title"
        defaultValue={daily.title}
        label="Titre"
        variant="filled"
        size="medium"
        fullWidth
        inputProps={{ "aria-label": "Title" }}
      />

      <FormTextField
        name="content"
        defaultValue={daily.content}
        variant="filled"
        size="medium"
        fullWidth
        multiline
        rows={15}
        inputProps={{ "aria-label": "Content" }}
      />
    </FormView>
  );
}