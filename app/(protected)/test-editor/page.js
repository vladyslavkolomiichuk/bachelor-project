import EditorWindow from "@/components/Editor/EditorWindow/editor-window";

export default function TestPage() {
  return (
    <EditorWindow
      isOpen={true}
      onCancel={false}
      content={`<h1>Main Topic 1</h1><h2>Subtopic 1</h2><p>Note or Thought</p><h2>Subtopic 2</h2><p>Note or Thought</p><h2>Subtopic 3</h2><p>Note or Thought</p><h1>Main Topic 2</h1><h2>Subtopic 1</h2><p>Note or Thought</p><h2>Subtopic 2</h2><p>Note or Thought</p><h2>Subtopic 3</h2><p>Note or Thought</p><h1>Main Topic 3</h1><h2>Subtopic 1</h2><p>Note or Thought</p><h2>Subtopic 2</h2><p>Note or Thought</p><h2>Subtopic 3</h2><p>Note or Thought</p>`}
      bookId={1}
    />
  );
}
