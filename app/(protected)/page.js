import Section from "@/components/GeneralComponents/Section/section";
import ColoredBookBlock from "@/components/HomePageComponents/ColoredBooksBlock/colored-book-block";
import ColoredBookBlockSkeleton from "@/components/HomePageComponents/ColoredBooksBlock/colored-book-block-skeleton";
import TransparentBookBlock from "@/components/HomePageComponents/TransparentBookBlock/transparent-book-block";
import TransparentBookBlockSkeleton from "@/components/HomePageComponents/TransparentBookBlock/transparent-book-block-skeleton";

import {
  fetchNewSubjectBooks,
  fetchRecommendedBooksByRandom,
  fetchNewLanguageBooks,
} from "@/lib/books";
import { Suspense } from "react";

export default async function HomePage() {
  const { subject: newSubject, books: newSubjectBooks } =
    await fetchNewSubjectBooks(12);
  const recommendedBooksBySubject = await fetchRecommendedBooksByRandom(
    "subject",
    [
      "Young Adult",
      "Children Fiction",
      "FICTION Horror",
      "FICTION Science Fiction",
      "History",
    ],
    24
  );
  const recommendedBooksByAuthor = await fetchRecommendedBooksByRandom(
    "author",
    [
      "Fyodor Dostoevsky",
      "Charles Dickens",
      "Virginia Woolf",
      "William Faulkner",
      "Leo Tolstoy",
    ],
    36
  );
  // const { language: newLanguage, books: newLanguageBooks } =
  //   await fetchNewLanguageBooks(12);

  return (
    <>
      <Section sectionName={`Try Something New - ${newSubject}`} inlineSlider>
        {newSubjectBooks.map((book) => (
          <Suspense key={book.isbn13} fallback={<ColoredBookBlockSkeleton />}>
            <ColoredBookBlock key={book.isbn13} book={book} />
          </Suspense>
        ))}
      </Section>
      <div className="double-section">
        <Section sectionName="Books For You" gridSlider slidesToShow={8}>
          {recommendedBooksBySubject.map((book) => (
            <Suspense
              key={book.isbn13}
              fallback={<TransparentBookBlockSkeleton />}
            >
              <TransparentBookBlock key={book.isbn13} book={book} />
            </Suspense>
          ))}
        </Section>
        <Section sectionName="Our Lovely Genres"></Section>
      </div>
      <Section sectionName={`Your Lovely Authors' books`} gridSlider slidesToShow={10} >
        {recommendedBooksByAuthor.map((book) => (
          <Suspense
            key={book.isbn13}
            fallback={<TransparentBookBlockSkeleton />}
          >
            <TransparentBookBlock key={book.isbn13} book={book} />
          </Suspense>
        ))}
      </Section>
      {/* <Section sectionName={`Open New Language - ${newLanguage}`} inlineSlider slidesToShow={5}>
        {newLanguageBooks.map((book) => (
          <Suspense key={book.isbn13} fallback={<TransparentBookBlockSkeleton />}>
            <TransparentBookBlock key={book.isbn13} book={book} />
          </Suspense>
        ))}
      </Section> */}
    </>
  );
}
