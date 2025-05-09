import styles from "./slider-buttons.module.css";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";

export default function SliderButtons({
  updateCurrentIndex,
  currentIndex,
  totalSlides,
  slidesToShow,
  isAnimating,
}) {
  const nextSlide = () => {
    if (isAnimating) return;
    if (currentIndex + slidesToShow < totalSlides) {
      updateCurrentIndex(currentIndex + slidesToShow);
    } else {
      updateCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (isAnimating) return;
    if (currentIndex - slidesToShow >= 0) {
      updateCurrentIndex(currentIndex - slidesToShow);
    } else {
      updateCurrentIndex(totalSlides - slidesToShow);
    }
  };

  return (
    <div className={styles.sliderButtons}>
      <button className={styles.arrows} onClick={prevSlide} disabled={isAnimating}>
        <ChevronLeft strokeWidth={3} />
      </button>
      {Array.from(
        { length: Math.ceil(totalSlides / slidesToShow) },
        (_, index) => (
          <button
            key={index}
            className={`${styles.circle} ${
              currentIndex / slidesToShow === index ? styles.active : ""
            }`}
            onClick={() => {
              if (isAnimating) return;
              updateCurrentIndex(index * slidesToShow);
            }}
            disabled={isAnimating}
          >
            <Circle strokeWidth={4} />
          </button>
        )
      )}
      <button className={styles.arrows} onClick={nextSlide} disabled={isAnimating}>
        <ChevronRight strokeWidth={3} />
      </button>
    </div>
  );
}
