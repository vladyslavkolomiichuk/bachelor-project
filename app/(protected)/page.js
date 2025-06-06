"use client";

import Section from "@/components/GeneralComponents/Section/section";
import ColoredBookBlock from "@/components/HomePageComponents/ColoredBooksBlock/colored-book-block";
import ColoredBookBlockSkeleton from "@/components/Loading/Components/colored-book-block-skeleton";
import TransparentBookBlock from "@/components/HomePageComponents/TransparentBookBlock/transparent-book-block";
import TransparentBookBlockSkeleton from "@/components/Loading/Components/transparent-book-block-skeleton";
import {
  fetchNewSubjectBooks,
  fetchRecommendedBooksByRandom,
  getAllBooks,
} from "@/lib/api/books";
import { useEffect, useState } from "react";
import BooksList from "@/components/HomePageComponents/BooksList/books-list";
import {
  getRatingByBookIsbn,
  getUserBookAuthors,
  getUserBookSubjects,
} from "@/lib/db/book";
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

  const [loading, setLoading] = useState(true);

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
        setLoading(false);
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

        const newBooksWithRatings = await Promise.all(
          newBooks.map(async (book) => {
            const rating = await getRatingByBookIsbn(book.isbn13);
            return { ...book, rating };
          })
        );

        setNewSubject(newSubj);
        setNewSubjectBooks(newBooksWithRatings);

        const recommendedBySubject = await fetchRecommendedBooksByRandom(
          "subject",
          subjects,
          24
        );

        const recommendedBySubjectWithRatings = await Promise.all(
          recommendedBySubject.map(async (book) => {
            const rating = await getRatingByBookIsbn(book.isbn13);
            return { ...book, rating };
          })
        );

        setRecommendedBooksBySubject(recommendedBySubjectWithRatings);

        const recommendedByAuthor = await fetchRecommendedBooksByRandom(
          "author",
          authors,
          36
        );

        const recommendedByAuthorWithRatings = await Promise.all(
          recommendedByAuthor.map(async (book) => {
            const rating = await getRatingByBookIsbn(book.isbn13);
            return { ...book, rating };
          })
        );

        setRecommendedBooksByAuthor(recommendedByAuthorWithRatings);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [isPersonalized]);

  return (
    <>
      <Section sectionName={`Try Something New - ${newSubject}`} inlineSlider>
        {!loading ? (
          newSubjectBooks.map((book) => (
            <ColoredBookBlock book={book} key={book.isbn13} />
          ))
        ) : (
          <>
            <ColoredBookBlockSkeleton />
            <ColoredBookBlockSkeleton />
            <ColoredBookBlockSkeleton />
            <ColoredBookBlockSkeleton />
          </>
        )}
      </Section>
      <div className="double-section">
        <Section sectionName="Books For You" gridSlider slidesToShow={8}>
          {!loading ? (
            recommendedBooksBySubject.map((book) => (
              <TransparentBookBlock key={book.isbn13} book={book} />
            ))
          ) : (
            <>
              <TransparentBookBlockSkeleton />
              <TransparentBookBlockSkeleton />
              <TransparentBookBlockSkeleton />
              <TransparentBookBlockSkeleton />
              <TransparentBookBlockSkeleton />
              <TransparentBookBlockSkeleton />
              <TransparentBookBlockSkeleton />
              <TransparentBookBlockSkeleton />
            </>
          )}
        </Section>
        <Section sectionName="Our Lovely Genres"></Section>
      </div>
      <Section
        sectionName="Your Lovely Authors' books"
        gridSlider
        slidesToShow={10}
      >
        {!loading ? (
          recommendedBooksByAuthor.map((book) => (
            <TransparentBookBlock key={book.isbn13} book={book} />
          ))
        ) : (
          <>
            <TransparentBookBlockSkeleton />
            <TransparentBookBlockSkeleton />
            <TransparentBookBlockSkeleton />
            <TransparentBookBlockSkeleton />
            <TransparentBookBlockSkeleton />
            <TransparentBookBlockSkeleton />
            <TransparentBookBlockSkeleton />
            <TransparentBookBlockSkeleton />
            <TransparentBookBlockSkeleton />
            <TransparentBookBlockSkeleton />
          </>
        )}
      </Section>
      <Section sectionName="All Books">
        <BooksList getBooks={getAllBooks} />
      </Section>
    </>
  );
}
