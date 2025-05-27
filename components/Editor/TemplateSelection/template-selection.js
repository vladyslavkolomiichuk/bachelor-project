import { useEffect, useState } from "react";
import templates from "@/data/note_templates.json";

import styles from "./template-selection.module.css";

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
