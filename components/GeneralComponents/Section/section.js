"use client";

import { Children, useState } from "react";
import SliderButtons from "../SliderButtons/slider-buttons";

import styles from "./section.module.css";

export default function Section({
  sectionName,
  multi = false,
  children,
  inlineSlider = false,
  gridSlider = false,
  slidesToShow = 4,
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [currentSlideIndexes, setCurrentSlideIndexes] = useState(
    multi ? children.map(() => 0) : [0]
  );
  const childrenArray = Children.toArray(children);

  const isArraySectionName = Array.isArray(sectionName);
  const totalChildren = multi
    ? children.map((child) => Children.count(child.props?.children || []))
    : Children.count(children);

  const updateCurrentSlideIndex = (sectionIndex, newIndex) => {
    setCurrentSlideIndexes((prev) => {
      const updated = [...prev];
      updated[sectionIndex] = newIndex;
      return updated;
    });
  };

  const getSectionChildren = () => {
    if (multi) {
      const child = childrenArray[activeSection];
      const useInlineSlider = child.props.inlineSlider;
      const useGridSlider = child.props.gridSlider;
      const sectionSlidesToShow = child.props.slidesToShow || slidesToShow;
      const sectionChildren = Children.toArray(child.props.children);
      const currentSlideIndex = currentSlideIndexes[activeSection];

      if (useInlineSlider || useGridSlider) {
        const slicedChildren = sectionChildren.slice(
          currentSlideIndex,
          currentSlideIndex + sectionSlidesToShow
        );

        return (
          <div
            className={`${
              useInlineSlider ? styles.flexContainer : styles.gridContainer
            } ${isAnimating ? styles.animation : ""}`}
          >
            {slicedChildren}
          </div>
        );
      }

      return <div>{child}</div>;
    }

    if (inlineSlider || gridSlider) {
      const slicedChildren = Children.toArray(children).slice(
        currentSlideIndexes[0],
        currentSlideIndexes[0] + slidesToShow
      );

      return (
        <div
          className={`${
            inlineSlider ? styles.flexContainer : styles.gridContainer
          } ${isAnimating ? styles.animation : ""}`}
        >
          {slicedChildren}
        </div>
      );
    }

    return children;
  };

  const handleSlideChange = (newIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    updateCurrentSlideIndex(multi ? activeSection : 0, newIndex);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section className={styles.section}>
      <div className={styles.sectionPanel}>
        <div className={styles.sectionNameContainer}>
          {multi ? (
            sectionName.map((name, index) => (
              <h2
                key={index}
                className={`${styles.sectionNames} ${
                  activeSection === index ? styles.activeSectionName : ""
                }`}
                onClick={() => {
                  if (!isAnimating) setActiveSection(index);
                }}
              >
                {name}
              </h2>
            ))
          ) : (
            <h2 className={styles.sectionName}>
              {isArraySectionName ? sectionName[0] : sectionName}
            </h2>
          )}
        </div>
        {(multi
          ? childrenArray[activeSection]?.props?.inlineSlider ||
            childrenArray[activeSection]?.props?.gridSlider
          : inlineSlider || gridSlider) && (
          <SliderButtons
            updateCurrentIndex={handleSlideChange}
            currentIndex={
              multi
                ? currentSlideIndexes[activeSection]
                : currentSlideIndexes[0]
            }
            totalSlides={multi ? totalChildren[activeSection] : totalChildren}
            slidesToShow={
              multi
                ? children[activeSection].props.slidesToShow || slidesToShow
                : slidesToShow
            }
            isAnimating={isAnimating}
          />
        )}
      </div>
      {getSectionChildren()}
    </section>
  );
}
