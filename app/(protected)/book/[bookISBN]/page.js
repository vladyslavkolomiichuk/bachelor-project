import UnaddedBook from "@/components/BookPageComponents/UnaddedBook/unadded-book";
import AddedBook from "@/components/BookPageComponents/AddedBook/added-book";
import { fetchBookByISBN, getGoogleBookLink } from "@/lib/api/books";
import { getColorsFromImage } from "@/lib/color-finder";
import { verifyAuth } from "@/lib/auth";
import { isBookInDb } from "@/lib/db/book";

export default async function BookPage({ params }) {
  const { bookISBN } = await params;

  const result = await verifyAuth();

  let bookDb = null;

  if (result.user) {
    bookDb = await isBookInDb(bookISBN, result.user.id);
  }

  let fullBook = null;

  if (!bookDb) {
    const bookApi = await fetchBookByISBN(bookISBN);
    const buyLink = await getGoogleBookLink(bookISBN);
    fullBook = { ...bookApi, buy_link: buyLink };
  }

  const coverImg =
    (bookDb ? bookDb.image : fullBook.image) || "/default-image.png";
  const colors = await getColorsFromImage(coverImg);
  const dominantColor = colors[3];

  return bookDb ? (
    <AddedBook
      book={bookDb}
      bookColor={dominantColor}
      userId={result.user.id}
    />
  ) : (
    <UnaddedBook book={fullBook} bookColor={dominantColor} isUserLoggedIn={result?.user} />
  );
}
