import styles from "./menu-bar.module.css";
import Buttons from "./buttons-render";
import { BubbleMenu } from "@tiptap/react";
import { Bold, Highlighter, Italic, Strikethrough, Underline } from "lucide-react";

export default function BubbleMenuBar({ editor }) {
  if (!editor) {
    return null;
  }

  const BubbleMenuOptions = [
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
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
    },
  ];

  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <div className={styles.bubbleMenu}>
        <Buttons buttons={BubbleMenuOptions} btnStyle={styles.menubarButton} />
      </div>
    </BubbleMenu>
  );
}
