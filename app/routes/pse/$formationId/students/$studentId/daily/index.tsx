import Callout from "~/component/typography/Callout";
import InternalLink from "~/component/typography/InternalLink";

export default function NoteIndexPage() {
  return (
    <Callout severity="info">
     Aucune note sélectionnée. 
     <br />
     Sélectionnez une note sur la gauche, ou{" "}
      <InternalLink to="new">
        créer une note.
      </InternalLink>
    </Callout>
  );
}