"use client";

import Section from "@/components/GeneralComponents/Section/section";
import ColoredBookBlock from "@/components/HomePageComponents/ColoredBooksBlock/colored-book-block";
import ColoredBookBlockSkeleton from "@/components/HomePageComponents/ColoredBooksBlock/colored-book-block-skeleton";
import TransparentBookBlock from "@/components/HomePageComponents/TransparentBookBlock/transparent-book-block";
import TransparentBookBlockSkeleton from "@/components/HomePageComponents/TransparentBookBlock/transparent-book-block-skeleton";
import {
  fetchNewSubjectBooks,
  fetchRecommendedBooksByRandom,
  getAllBooks,
} from "@/lib/api/books";
import { Suspense, useEffect, useState } from "react";
import BooksList from "@/components/HomePageComponents/BooksList/books-list";
import { getUserBookAuthors, getUserBookSubjects } from "@/lib/db/book";
import { verifyAuth } from "@/lib/auth";

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

export default function HomePage() {
  const [user, setUser] = useState(undefined);

  const [subjects, setSubjects] = useState(SUBJECTS);
  const [authors, setAuthors] = useState(AUTHORS);

  const [newSubject, setNewSubject] = useState("");
  const [newSubjectBooks, setNewSubjectBooks] = useState([]);
  const [recommendedBooksBySubject, setRecommendedBooksBySubject] = useState(
    []
  );
  const [recommendedBooksByAuthor, setRecommendedBooksByAuthor] = useState([]);

  const [isPersonalized, setIsPersonalized] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await verifyAuth();
        setUser(result?.user ?? null);
      } catch (error) {
        setUser(null);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user === undefined) {
      return;
    }

    if (user === null) {
      setIsPersonalized(true);
      return;
    }

    async function fetchUserPrefs() {
      console.log("as");

      try {
        const userSubjects = await getUserBookSubjects(user.id);
        const userAuthors = await getUserBookAuthors(user.id);

        if (userSubjects && userSubjects.length >= 3) {
          setSubjects(userSubjects);
        }

        if (userAuthors && userAuthors.length >= 3) {
          setAuthors(userAuthors);
        }
      } catch (error) {
        console.error("Failed to fetch user preferences:", error);
      } finally {
        setIsPersonalized(true);
      }
    }

    fetchUserPrefs();
  }, [user]);

  useEffect(() => {
    if (!isPersonalized) return;

    async function fetchBooks() {
      try {
        const { subject: newSubj, books: newBooks } =
          await fetchNewSubjectBooks(12);
        setNewSubject(newSubj);
        setNewSubjectBooks(newBooks);

        const recommendedBySubject = await fetchRecommendedBooksByRandom(
          "subject",
          subjects,
          24
        );
        setRecommendedBooksBySubject(recommendedBySubject);

        const recommendedByAuthor = await fetchRecommendedBooksByRandom(
          "author",
          authors,
          36
        );
        setRecommendedBooksByAuthor(recommendedByAuthor);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    }

    fetchBooks();
  }, [isPersonalized]);

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
        <BooksList getBooks={getAllBooks} />
      </Section>
    </>
  );
}
