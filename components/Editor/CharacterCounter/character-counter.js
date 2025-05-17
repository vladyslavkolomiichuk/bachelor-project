import { WholeWord } from "lucide-react";
import styles from "./character-counter.module.css";

export default function CharacterCountContainer({ editor }) {
  if (!editor) {
    return null;
  }

  // return (
  //   <div
  //     className={`${styles.characterCount} ${
  //       editor.storage.characterCount.characters() === limit
  //         ? styles.characterCountWarning
  //         : ""
  //     }`}
  //   >
  //     <WholeWord />
  //     <div>
  //       {editor.storage.characterCount.characters()} / {limit} characters
  //       <br />
  //       {editor.storage.characterCount.words()} words
  //     </div>
  //   </div>
  // );
  return (
    <div className={styles.characterCount}>
      <WholeWord />
      <div>
        {editor.storage.characterCount.characters()} characters
        <br />
        {editor.storage.characterCount.words()} words
      </div>
    </div>
  );
}
