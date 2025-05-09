import DescriptionSection from "../DescriptionSection/description-section";

import styles from "./full-book-description.module.css";

export default function FullBookDescription({ book }) {
  const {
    isbn13,
    title_long: longTitle,
    synopsis,
    subjects,
    language,
    pages,
    date_published: publishDate,
    publisher,
    binding,
    dimensions,
  } = book;
  return (
    <>
      <div className={styles.fullBookDescription}>
        <div className={styles.mainPart}>
          {longTitle ? (
            <DescriptionSection title="Long Title">
              <p>{longTitle}</p>
            </DescriptionSection>
          ) : null}
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
        <div className={styles.secondPart}>
          <DescriptionSection title="AI Description">
            <p>Not Available For Now</p>
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
      <div className={styles.reviewContainer}>
        <DescriptionSection title="Average Rating"></DescriptionSection>
        <DescriptionSection title="Reviews"></DescriptionSection>
      </div>
    </>
  );
}
