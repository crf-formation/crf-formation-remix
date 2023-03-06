import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p>
     Aucune note sélectionnée. Sélectionnez une note sur la gauche, ou{" "}
      <Link to="new" className="text-blue-500 underline">
        créer une note
      </Link>
    </p>
  );
}