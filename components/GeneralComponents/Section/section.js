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
  const childrenArray = Children.toArray(children);
  const isArraySectionName = Array.isArray(sectionName);

  const [isAnimating, setIsAnimating] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const [currentSlideIndexes, setCurrentSlideIndexes] = useState(
    multi ? childrenArray.map(() => 0) : [0]
  );

  const [activeCategories, setActiveCategories] = useState(
    multi
      ? childrenArray.map((child) => child.props.categories?.[0]?.key || null)
      : [childrenArray[0]?.props.categories?.[0]?.key || null]
  );

  const updateCurrentSlideIndex = (sectionIndex, newIndex) => {
    setCurrentSlideIndexes((prev) => {
      const updated = [...prev];
      updated[sectionIndex] = newIndex;
      return updated;
    });
  };

  const updateActiveCategory = (sectionIndex, newCategory) => {
    setActiveCategories((prev) => {
      const updated = [...prev];
      updated[sectionIndex] = newCategory;
      return updated;
    });
  };

  const getSectionChildren = () => {
    if (multi) {
      const child = childrenArray[activeSection];
      const sectionChildren = Children.toArray(child.props.children);
      const sectionCategories = child.props.categories;
      const sectionInlineSlider = child.props.inlineSlider;
      const sectionGridSlider = child.props.gridSlider;
      const sectionSlidesToShow = child.props.slidesToShow || slidesToShow;
      const currentSlideIndex = currentSlideIndexes[activeSection];
      const currentCategory = activeCategories[activeSection];

      if (sectionCategories) {
        const filtered =
          currentCategory === "all"
            ? sectionChildren
            : sectionChildren.filter(
                (c) => c.props.category === currentCategory
              );

        return <div {...child.props}>{filtered}</div>;
      }

      if (sectionInlineSlider || sectionGridSlider) {
        const slicedChildren = sectionChildren.slice(
          currentSlideIndex,
          currentSlideIndex + sectionSlidesToShow
        );

        return (
          <div
            className={`${
              sectionInlineSlider ? styles.flexContainer : styles.gridContainer
            } ${isAnimating ? styles.animation : ""}`}
          >
            {slicedChildren}
          </div>
        );
      }

      return <>{child}</>;
    }

    // not multi
    const sectionCategories = childrenArray[0]?.props.categories;
    const currentCategory = activeCategories[0];

    if (sectionCategories) {
      const wrapper =
        currentCategory === "all"
          ? childrenArray[0]
          : childrenArray.find(
              (child) => child.props.category === currentCategory
            );

      const filtered =
        currentCategory === "all"
          ? childrenArray.flatMap((child) =>
              Children.toArray(child.props.children)
            )
          : Children.toArray(wrapper?.props.children || []);

      return <div {...(wrapper?.props || {})}>{filtered}</div>;
    }

    if ((inlineSlider || gridSlider) && !sectionCategories) {
      const slicedChildren = childrenArray.slice(
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
              <h1
                key={index}
                className={`${styles.sectionNames} ${
                  activeSection === index ? styles.activeSectionName : ""
                }`}
                onClick={() => {
                  if (!isAnimating) setActiveSection(index);
                }}
              >
                {name}
              </h1>
            ))
          ) : (
            <h1 className={styles.sectionName}>
              {isArraySectionName ? sectionName[0] : sectionName}
            </h1>
          )}
        </div>

        {multi &&
          childrenArray[activeSection]?.props.categories &&
          childrenArray[activeSection].props.categories.length > 0 && (
            <div className={styles.categorySelectContainer}>
              <select
                value={activeCategories[activeSection] || "all"}
                onChange={(e) =>
                  updateActiveCategory(activeSection, e.target.value)
                }
                className={styles.categorySelect}
              >
                {childrenArray[activeSection].props.categories.map(
                  ({ key, label }) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

        {!multi &&
          childrenArray[0]?.props.categories &&
          childrenArray[0].props.categories.length > 0 && (
            <div className={styles.categorySelectContainer}>
              <select
                value={activeCategories[0]}
                onChange={(e) => updateActiveCategory(0, e.target.value)}
                className={styles.categorySelect}
              >
                {childrenArray[0].props.categories.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          )}

        {(multi
          ? !childrenArray[activeSection]?.props?.categories &&
            (childrenArray[activeSection]?.props?.inlineSlider ||
              childrenArray[activeSection]?.props?.gridSlider)
          : !childrenArray[0]?.props?.categories &&
            (inlineSlider || gridSlider)) && (
          <SliderButtons
            updateCurrentIndex={handleSlideChange}
            currentIndex={
              multi
                ? currentSlideIndexes[activeSection]
                : currentSlideIndexes[0]
            }
            totalSlides={
              multi
                ? Children.count(childrenArray[activeSection].props.children)
                : Children.count(children)
            }
            slidesToShow={
              multi
                ? childrenArray[activeSection].props.slidesToShow ||
                  slidesToShow
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
