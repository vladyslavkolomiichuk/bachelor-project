"use client";

import { sanitizeInputFront } from "@/lib/sanitize-text";
import AIBookBlock from "../AIBookBlock/ai-book-block";
import DescriptionSection from "../DescriptionSection/description-section";
import AverageRating from "../ReviewsComponents/AverageRating/average-rating";
import ReviewsList from "../ReviewsComponents/Reviews/reviews-list";

import styles from "./full-book-description.module.css";

export default function FullBookDescription({ book }) {
  const {
    id,
    isbn13,
    doi,
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

  const clearSynopsis = sanitizeInputFront(synopsis);

  return (
    <div>
      <div className={styles.fullBookDescription}>
        <div className={styles.part}>
          {longTitle && (
            <DescriptionSection title="Long Title">
              <p>{longTitle}</p>
            </DescriptionSection>
          )}
          {clearSynopsis && (
            <DescriptionSection title="Synopsis">
              <p dangerouslySetInnerHTML={{ __html: clearSynopsis }} />
            </DescriptionSection>
          )}
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
              {isbn13 ? "ISBN" : "DOI"} {isbn13 || doi} {publishDate}{" "}
              {publisher}
            </p>
          </DescriptionSection>
          <DescriptionSection title="Book Details">
            <p>
              Language: {language} Page count: {pages} {binding || ""}
              {dimensions
                ? `: ${dimensions.toLowerCase().replace(/:/g, " ")}`
                : ""}
            </p>
          </DescriptionSection>
        </div>
      </div>

      <div className={styles.reviewContainer}>
        <div className={styles.part}>
          <DescriptionSection title="Average Rating">
            <AverageRating bookId={id} bookIsbn={isbn13} />
          </DescriptionSection>
        </div>
        <div className={styles.part}>
          <DescriptionSection title="Reviews">
            <ReviewsList bookId={id} />
          </DescriptionSection>
        </div>
      </div>
    </div>
  );
}
