import Section from "@/components/GeneralComponents/Section/section";
import ColoredBookBlock from "@/components/HomePageComponents/ColoredBooksBlock/colored-book-block";
import ColoredBookBlockSkeleton from "@/components/HomePageComponents/ColoredBooksBlock/colored-book-block-skeleton";
import TransparentBookBlock from "@/components/HomePageComponents/TransparentBookBlock/transparent-book-block";
import TransparentBookBlockSkeleton from "@/components/HomePageComponents/TransparentBookBlock/transparent-book-block-skeleton";
import { verifyAuth } from "@/lib/auth";
import {
  fetchNewSubjectBooks,
  fetchRecommendedBooksByRandom,
  getAllBooks,
} from "@/lib/api/books";
import { Suspense } from "react";
import BooksList from "@/components/HomePageComponents/BooksList/books-list";
import { getUserBookAuthors, getUserBookSubjects } from "@/lib/db/book";

const SUBJECTS = [
  "Young Adult",
  "Children Fiction",
  "FICTION Horror",
  "FICTION Science Fiction",
  "History",
];

const AUTHORS = [
  "Fyodor Dostoevsky",
  "Charles Dickens",
  "Virginia Woolf",
  "William Faulkner",
  "Leo Tolstoy",
];

export default async function HomePage() {
  let subjects = SUBJECTS;
  let authors = AUTHORS;

  const result = await verifyAuth();

  if (result.user) {
    const userId = result.user.id;

    const userSubjects = await getUserBookSubjects(userId);
    const userAuthors = await getUserBookAuthors(userId);

    if (userSubjects && userSubjects.length >= 3) {
      subjects = userSubjects;
    }

    if (userAuthors && userAuthors.length >= 3) {
      authors = userAuthors;
    }
  }

  const { subject: newSubject, books: newSubjectBooks } =
    await fetchNewSubjectBooks(12);
  const recommendedBooksBySubject = await fetchRecommendedBooksByRandom(
    "subject",
    subjects,
    24
  );
  const recommendedBooksByAuthor = await fetchRecommendedBooksByRandom(
    "author",
    authors,
    36
  );

  const handleGetAllBooks = async (limit, page) => {
    "use server";
    const result = await getAllBooks(limit, page);
    return result;
  };

  return (
    <>
      <Section sectionName={`Try Something New - ${newSubject}`} inlineSlider>
        {newSubjectBooks.map((book) => (
          <Suspense key={book.isbn13} fallback={<ColoredBookBlockSkeleton />}>
            <ColoredBookBlock book={book} />
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
              <TransparentBookBlock book={book} />
            </Suspense>
          ))}
        </Section>
        <Section sectionName="Our Lovely Genres"></Section>
      </div>
      <Section
        sectionName="Your Lovely Authors' books"
        gridSlider
        slidesToShow={10}
      >
        {recommendedBooksByAuthor.map((book) => (
          <Suspense
            key={book.isbn13}
            fallback={<TransparentBookBlockSkeleton />}
          >
            <TransparentBookBlock book={book} />
          </Suspense>
        ))}
      </Section>
      <Section sectionName="All Books">
        <BooksList getBooks={handleGetAllBooks} />
      </Section>
    </>
  );
}
