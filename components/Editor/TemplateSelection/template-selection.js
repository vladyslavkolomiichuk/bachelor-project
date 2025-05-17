import { useEffect, useState } from "react";

import styles from "./template-selection.module.css";

const templates = [
  {
    id: 1,
    name: "The Outline method",
    description:
      "The outline method of taking notes is one of the most intuitive and simplest options on this list. As the name suggests, this method turns notes into a hierarchy of information, providing a logical flow of content on the page and keeping it highly organized.",
    preview: "/templatePreview/outline-method.png",
    content:
      "<h1>Main Topic 1</h1><h2>Subtopic 1</h2><p>Note or Thought</p><h2>Subtopic 2</h2><p>Note or Thought</p><h2>Subtopic 3</h2><p>Note or Thought</p><h1>Main Topic 2</h1><h2>Subtopic 1</h2><p>Note or Thought</p><h2>Subtopic 2</h2><p>Note or Thought</p><h2>Subtopic 3</h2><p>Note or Thought</p><h1>Main Topic 3</h1><h2>Subtopic 1</h2><p>Note or Thought</p><h2>Subtopic 2</h2><p>Note or Thought</p><h2>Subtopic 3</h2><p>Note or Thought</p>",
  },
  {
    id: 2,
    name: "The Cornell method",
    description:
      "The Cornell method of note-taking was designed for students by Cornell University professor Walter Pauk. Similar to the outline method, Cornell encourages note-takers to keep clean, organized, and condensed notes. It’s an especially useful method for revisiting your notes, reviewing what you learned, and consolidating your new knowledge.",
    preview: "/templatePreview/cornell-method.png",
    content: `<table style="min-width: 276px"><colgroup><col style="width: 251px"><col style="min-width: 25px"></colgroup><tbody><tr><th colspan="1" rowspan="2" colwidth="251"><p style="text-align: center">Cue Column</p><ul><li><p style="text-align: center">Question 1</p></li><li><p style="text-align: center">Question 2</p></li><li><p style="text-align: center">Question 3</p></li><li><p style="text-align: center">Question 4</p></li></ul></th><td colspan="1" rowspan="2"><p style="text-align: center">Note-taking area</p></td></tr><tr></tr><tr><td colspan="2" rowspan="1" colwidth="251,0"><p style="text-align: center">Summary</p></td></tr></tbody></table>`,
  },
  {
    id: 3,
    name: "The Boxing method",
    description:
      "The boxing method of note-taking is geared toward those who are visual-dominant learners. This form of note-taking consists of creating boxes or outlines to represent different sections or ideas within your notes.",
    preview: "/templatePreview/boxing-method.png",
    content: `<table style="min-width: 75px"><colgroup><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"></colgroup><tbody><tr><th colspan="3" rowspan="1"><p style="text-align: center">Topic</p></th></tr><tr><td colspan="1" rowspan="1"><p style="text-align: center">Subtopic 1</p></td><td colspan="2" rowspan="2"><p style="text-align: center">Subtopic 4</p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: center">Subtopic 2</p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: center">Subtopic 3</p></td><td colspan="2" rowspan="1"><p style="text-align: center">Subtopic 5</p></td></tr></tbody></table>`,
  },
  {
    id: 4,
    name: "The Charting method",
    description:
      "The charting method of note-taking is one the most effective for fact- and data-heavy content. It involves creating a diagram or chart to represent the relationships between different concepts or ideas. When the content is highly structured and uniform, the charting method provides an efficient way to keep up with the material.",
    preview: "/templatePreview/charting-method.png",
    content: `<table style="min-width: 100px"><colgroup><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"><col style="min-width: 25px"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p style="text-align: center">Method</p></th><th colspan="1" rowspan="1"><p style="text-align: center">Description</p></th><th colspan="1" rowspan="1"><p style="text-align: center">Pros</p></th><th colspan="1" rowspan="1"><p style="text-align: center">Cons</p></th></tr><tr><td colspan="1" rowspan="1"><p style="text-align: center">Topic 1</p></td><td colspan="1" rowspan="1"><p style="text-align: center"></p></td><td colspan="1" rowspan="1"><p style="text-align: center"></p></td><td colspan="1" rowspan="1"><p style="text-align: center"></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: center">Topic 2</p></td><td colspan="1" rowspan="1"><p style="text-align: center"></p></td><td colspan="1" rowspan="1"><p style="text-align: center"></p></td><td colspan="1" rowspan="1"><p style="text-align: center"></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: center">Topic 3</p></td><td colspan="1" rowspan="1"><p style="text-align: center"></p></td><td colspan="1" rowspan="1"><p style="text-align: center"></p></td><td colspan="1" rowspan="1"><p style="text-align: center"></p></td></tr><tr><td colspan="1" rowspan="1"><p style="text-align: center">Topic 4</p></td><td colspan="1" rowspan="1"><p style="text-align: center"></p></td><td colspan="1" rowspan="1"><p style="text-align: center"></p></td><td colspan="1" rowspan="1"><p style="text-align: center"></p></td></tr></tbody></table>`,
  },
  {
    id: 5,
    name: "The Sentence method",
    description:
      "The sentence method of note-taking is the simplest and least structured strategy. It involves writing each idea as a complete sentence. When the content itself is not outlined, then the sentence method can help give your notes a slight structure that the topic is missing.",
    preview: "/templatePreview/sentence-method.png",
    content:
      "<h1>Main Topic</h1><ol><li><p> Sentence 1 </p></li><li><p>Sentence 2</p></li><li><p>Sentence 3</p></li><li><p>Sentence 4</p></li><li><p>…</p></li></ol>",
  },
  {
    id: 6,
    name: "Q/E/C Method",
    description:
      "With this method, you process your information directly. It's a method you can use when you have more time to take notes. Essentially, you turn the main topic into a question. Then you answer with several facts below and write a concluding sentence or two.",
    preview: "/templatePreview/q-method.png",
    content:
      "<h1>Main Topic</h1><p>Q: Question?</p><p>E: </p><ul><li><p>Evidence 1.</p></li><li><p>Evidence 2.</p></li><li><p>Evidence 3.</p></li></ul><p>C: Conclusion.</p>",
  },
];

export default function TemplateModal({ isOpen, onCancel, setTemplate }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onMouseMove={handleMouseMove}>
      <div className={styles.modal}>
        <div className={styles.message}>
          <h1>You have to choose a template for your note</h1>
          <p>
            You can choose different templates for your note from the selector
            below.
          </p>
        </div>
        <div className={styles.templates}>
          {templates.map((template) => (
            <div
              key={template.id}
              className={`${styles.template} ${
                selectedTemplate?.id === template.id ? styles.selected : ""
              }`}
              onClick={() => handleTemplateSelect(template)}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              <h2 className={styles.templateName}>{template.name}</h2>
              <p className={styles.templateDescription}>
                {template.description}
              </p>
            </div>
          ))}
        </div>

        {hoveredTemplate && (
          <div
            className={styles.previewContainer}
            style={{
              backgroundImage: `url(${
                templates.find((t) => t.id === hoveredTemplate).preview
              })`,
              left: cursorPosition.x + 10,
              top: cursorPosition.y + 10,
              position: "absolute",
              pointerEvents: "none",
              zIndex: 1000,
            }}
          />
        )}

        <div className={styles.buttons}>
          <button className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={styles.select}
            onClick={() => {
              setTemplate(selectedTemplate);
              onCancel();
            }}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
