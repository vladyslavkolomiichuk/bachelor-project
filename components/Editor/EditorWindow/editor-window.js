"use client";

import CircleButton from "@/components/GeneralComponents/CircleButton/circle-button";
import TextEditor from "../TextEditor/text-editor";
import styles from "./editor-window.module.css";
import { CheckCheck } from "lucide-react";
import ToC from "../ToC/ToC";
import { TimerProvider, useTimer } from "@/context/TimerContext";
import { useState } from "react";

export default function EditorWindow() {
  return (
    <TimerProvider>
      <EditorWindowContent />
    </TimerProvider>
  );
}

function EditorWindowContent() {
  const [content, setContent] = useState(
    "<h1>Title 1</h1><p>Some content here.</p><h2>Subtitle</h2><p>More content...</p>"
  );
  const { stopTimer } = useTimer();

  const handleSubmit = (e) => {
    e.preventDefault();
    stopTimer();
  };

  return (
    <div className={styles.editorWindow}>
      <ToC content={content} />
      <form className={styles.editorForm} onSubmit={handleSubmit}>
        <TextEditor content={content} setContent={setContent} />
        <CircleButton buttonType="submit" colorType="success">
          <CheckCheck />
        </CircleButton>
      </form>
    </div>
  );
}
