import UnaddedBook from "@/components/BookPageComponents/UnaddedBook/unadded-book";
import AddedBook from "@/components/BookPageComponents/AddedBook/added-book";

import {
  fetchBookByISBN,
  fetchNewReleasedBooks,
  getGoogleBookLink,
} from "@/lib/books";
import { getColorsFromImage } from "@/lib/color-finder";

export default async function BookPage({ params }) {
  const { bookISBN } = await params;

  //Temporary
  const buyLink = await getGoogleBookLink(bookISBN);

  const book = await fetchBookByISBN(bookISBN);
  const fullBook = { ...book, buyLink: buyLink };
  // const books = await fetchNewReleasedBooks(7);

  const coverImg = book.image || "/default-image.png";

  const colors = await getColorsFromImage(coverImg);

  const dominantColor = colors[3];

  return (
    <>
      <AddedBook book={fullBook} bookColor={dominantColor} />
    </>
  );
}
