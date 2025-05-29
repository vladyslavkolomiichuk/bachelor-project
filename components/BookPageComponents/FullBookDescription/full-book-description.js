import { ReviewsProvider } from "@/context/ReviewsContext";
import AIBookBlock from "../AIBookBlock/ai-book-block";
import DescriptionSection from "../DescriptionSection/description-section";
import AverageRating from "../ReviewsComponents/AverageRating/average-rating";
import ReviewsList from "../ReviewsComponents/Reviews/reviews-list";

import styles from "./full-book-description.module.css";

export default function FullBookDescription({ book }) {
  const {
    id,
    isbn13,
    title,
    title_long: longTitle,
    synopsis,
    authors,
    subjects,
    language,
    pages,
    date_published: publishDate,
    publisher,
    binding,
    dimensions,
  } = book;
  return (
    <div>
      <div className={styles.fullBookDescription}>
        <div className={styles.part}>
          {longTitle ? (
            <DescriptionSection title="Long Title">
              <p>{longTitle}</p>
            </DescriptionSection>
          ) : (
            ""
          )}
          <DescriptionSection title="Synopsis">
            <p>{synopsis}</p>
          </DescriptionSection>
          <DescriptionSection title="Subjects">
            <p>
              {Array.isArray(subjects) && subjects.length > 0
                ? subjects.join(", ")
                : "No subjects available"}
            </p>
          </DescriptionSection>
        </div>
        <div className={styles.part}>
          <DescriptionSection title="AI Description">
            <AIBookBlock title={title} authors={authors} subjects={subjects} />
          </DescriptionSection>
          <DescriptionSection title="Publication Details">
            <p>
              ISBN {isbn13} {publishDate} {publisher}
            </p>
          </DescriptionSection>
          <DescriptionSection title="Book Details">
            <p>
              Language: {language} Page count: {pages} {binding}:
              {dimensions
                ? dimensions.toLowerCase().replace(/:/g, " ")
                : "Dimensions not available"}
            </p>
          </DescriptionSection>
        </div>
      </div>
      
      <ReviewsProvider>
        <div className={styles.reviewContainer}>
          <div className={styles.part}>
            <DescriptionSection title="Average Rating">
              <AverageRating bookId={id} />
            </DescriptionSection>
          </div>
          <div className={styles.part}>
            <DescriptionSection title="Reviews">
              <ReviewsList bookId={id} />
            </DescriptionSection>
          </div>
        </div>
      </ReviewsProvider>
    </div>
  );
}
