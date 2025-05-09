import Section from "@/components/GeneralComponents/Section/section";
import BookPanel from "../BookPanel/book-panel";
import FullBookDescription from "../FullBookDescription/full-book-description";
import BookSmallPreview from "../BookSmallPreview/book-small-preview";
import BookLink from "@/components/GeneralComponents/BookLink/book-link";
import MyBookSlider from "../MyBookSlider/my-book-slider";

import styles from "./added-book.module.css";

export default function AddedBook({ book, bookColor }) {
  return (
    <div className={styles.addedBook}>
      <div className={styles.bookAndNote}>
        <BookPanel
          book={book}
          bookColor={bookColor}
          buttonText="Start Reading"
        />
        <Section sectionName={["Noting", "Book Description"]} multi>
          <div className={styles.notesContainer}>
            {/* {myNotes.map((note, index) => (
              <BookLink link={`/book/`} key={index}>
                <BookSmallPreview key={index} book={note} />
              </BookLink>
            ))} */}
          </div>
          <FullBookDescription book={book} />
        </Section>
      </div>
      {/* <MyBookSlider books={myNotes} bookColor={bookColor} /> */}
      {/* <div className={styles.sliderContainer}>
      </div> */}
    </div>
  );
}
