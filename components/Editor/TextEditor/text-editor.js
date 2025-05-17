"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "../MenuBar/menu-bar";
import CharacterCount from "@tiptap/extension-character-count";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { useTimer } from "@/context/TimerContext";
import { useEffect } from "react";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Typography from "@tiptap/extension-typography";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import BubbleMenuBar from "../MenuBar/bubble-menu-bar";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import CharacterCountContainer from "../CharacterCounter/character-counter";

import styles from "./text-editor.module.css";
import "./tiptap.css";

// const CHARACTER_LIMIT = 10000;

export default function TextEditor({ content, setContent }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({
        multicolor: true,
      }),
      // CharacterCount.configure({
      //   CHARACTER_LIMIT,
      // }),
      CharacterCount,
      Image,
      Underline,
      Typography,
      TextStyle,
      Color,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: styles.content,
      },
      handleDrop: (view, event, slice, moved) => {},
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const { startTimer } = useTimer();

  useEffect(() => {
    if (editor) {
      editor.on("focus", () => {
        startTimer();
      });
    }
  }, [editor, startTimer]);

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.textEditorContainer}>
      <MenuBar editor={editor} />
      <BubbleMenuBar editor={editor} />
      <div id="contentWrapper" className={styles.contentWrapper}>
        <EditorContent editor={editor} className={styles.editorContent} />
      </div>
      {/* <CharacterCountContainer editor={editor} limit={CHARACTER_LIMIT} /> */}
      <CharacterCountContainer editor={editor} />
    </div>
  );
}
