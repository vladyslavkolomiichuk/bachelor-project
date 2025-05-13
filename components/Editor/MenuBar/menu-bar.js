import {
  AArrowUp,
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BetweenHorizontalStart,
  BetweenVerticalStart,
  Bold,
  CaseSensitive,
  Code2,
  Grid2X2X,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image,
  Italic,
  List,
  ListCollapse,
  ListEnd,
  ListOrdered,
  Minus,
  Pause,
  Pilcrow,
  Redo2,
  Strikethrough,
  Table,
  TableCellsMerge,
  TextQuote,
  Underline,
  Undo2,
} from "lucide-react";

import styles from "./menu-bar.module.css";
import { useTimer } from "@/context/TimerContext";
import { useCallback, useState } from "react";
import Timer from "../Timer/timer";
import Buttons from "./buttons-render";
import DropdownMenuButton from "../DropdownMenuButton/dropdown-menu-button";

export default function MenuBar({ editor }) {
  if (!editor) {
    return null;
  }

  const { timer, isRunning, pauseTimer, startTimer } = useTimer();

  const UndoRedoOptions = [
    {
      icon: <Undo2 />,
      onClick: () => editor.chain().focus().undo().run(),
      pressed: null,
    },
    {
      icon: <Redo2 />,
      onClick: () => editor.chain().focus().redo().run(),
      pressed: null,
    },
  ];

  const HeadingOptions = [
    {
      icon: <Heading1 />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 }),
    },
  ];

  const TextStyleOptions = [
    {
      icon: <Bold />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: <Italic />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      icon: <Underline />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      pressed: editor.isActive("underline"),
    },
    {
      icon: <Highlighter />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .toggleHighlight({ color: "rgba(255, 234, 0, 0.38)" })
          .run(),
      pressed: editor.isActive("highlight"),
    },
  ];

  const TextAlignOptions = [
    {
      icon: <AlignLeft />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
    },
  ];

  const ListOptions = [
    {
      icon: <List />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
  ];

  const TableOptions = [
    {
      icon: <Table />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
      pressed: null,
    },
    {
      icon: <BetweenVerticalStart />,
      onClick: () => editor.chain().focus().addColumnAfter().run(),
      pressed: null,
    },
    {
      icon: <Grid2X2X style={{ transform: "rotate(-180deg)" }} />,
      onClick: () => editor.chain().focus().deleteColumn().run(),
      pressed: null,
    },
    {
      icon: <BetweenHorizontalStart />,
      onClick: () => editor.chain().focus().addRowAfter().run(),
      pressed: null,
    },
    {
      icon: <Grid2X2X />,
      onClick: () => editor.chain().focus().deleteRow().run(),
      pressed: null,
    },
    {
      icon: <TableCellsMerge />,
      onClick: () => editor.chain().focus().mergeOrSplit().run(),
      pressed: null,
    },
    {
      icon: <AArrowUp />,
      onClick: () => editor.chain().focus().toggleHeaderCell().run(),
      pressed: null,
    },
  ];

  const OtherOptions = [
    {
      icon: <TextQuote />,
      onClick: () => editor.chain().focus().setBlockquote().run(),
      pressed: editor.isActive("blockquote"),
    },

    {
      icon: <ListEnd />,
      onClick: () => editor.chain().focus().setHardBreak().run(),
      pressed: null,
    },
    {
      icon: <Minus />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      pressed: null,
    },
  ];

  const addImage = useCallback(() => {
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const SpecialOptions = [
    {
      icon: <Code2 />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      pressed: editor.isActive("codeBlock"),
    },
    {
      icon: <Image />,
      onClick: addImage,
      pressed: null,
    },
  ];

  const handlePauseTimer = () => {
    pauseTimer();
  };

  const handleStartTimer = () => {
    startTimer();
  };

  return (
    <div className={styles.menubarContainer}>
      <Buttons buttons={UndoRedoOptions} btnStyle={styles.menubarButton} />

      <div className={styles.separator}></div>

      <input
        type="color"
        className={styles.menubarButton}
        onInput={(event) =>
          editor.chain().focus().setColor(event.target.value).run()
        }
        value={editor.getAttributes("textStyle").color || "#f2f2f3"}
      />

      {/* <DropdownMenuButton
        MainBtn="Fonts"
        mainBtnStyles={styles.menubarButton}
      >
        <Buttons buttons={HeadingOptions} btnStyle={styles.menubarButton} />
      </DropdownMenuButton> */}

      <div className={styles.separator}></div>

      <Buttons buttons={TextStyleOptions} btnStyle={styles.menubarButton} />

      <div className={styles.invisibleSeparator}></div>

      <DropdownMenuButton
        MainBtn={<Heading />}
        mainBtnStyles={styles.menubarButton}
      >
        <Buttons buttons={HeadingOptions} btnStyle={styles.menubarButton} />
      </DropdownMenuButton>

      <DropdownMenuButton
        MainBtn={<AlignJustify />}
        mainBtnStyles={styles.menubarButton}
      >
        <Buttons buttons={TextAlignOptions} btnStyle={styles.menubarButton} />
      </DropdownMenuButton>

      <DropdownMenuButton
        MainBtn={<ListCollapse />}
        mainBtnStyles={styles.menubarButton}
      >
        <Buttons buttons={ListOptions} btnStyle={styles.menubarButton} />
      </DropdownMenuButton>

      <DropdownMenuButton
        MainBtn={<Table />}
        mainBtnStyles={styles.menubarButton}
      >
        <Buttons buttons={TableOptions} btnStyle={styles.menubarButton} />
      </DropdownMenuButton>

      <div className={styles.invisibleSeparator}></div>

      <Buttons buttons={OtherOptions} btnStyle={styles.menubarButton} />

      <div className={styles.separator}></div>

      <Buttons buttons={SpecialOptions} btnStyle={styles.menubarButton} />

      <div className={styles.separator}></div>

      <Timer
        timer={timer}
        isTimerRunning={isRunning}
        btnStyle={styles.menubarButton}
        onPauseClick={handlePauseTimer}
        onStartClick={handleStartTimer}
      />
    </div>
  );
}
