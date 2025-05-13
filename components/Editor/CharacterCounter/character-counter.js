import { WholeWord } from "lucide-react";
import styles from "./character-counter.module.css";

export default function CharacterCountContainer({ editor, limit }) {
  if (!editor) {
    return null;
  }

  const percentage = editor
    ? Math.round((100 / limit) * editor.storage.characterCount.characters())
    : 0;

  return (
    <div
      className={`${styles.characterCount} ${
        editor.storage.characterCount.characters() === limit
          ? styles.characterCountWarning
          : ""
      }`}
    >
      <WholeWord />
      <div>
        {editor.storage.characterCount.characters()} / {limit} characters
        <br />
        {editor.storage.characterCount.words()} words
      </div>
    </div>
  );
}
