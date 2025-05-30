import UnaddedBook from "@/components/BookPageComponents/UnaddedBook/unadded-book";
import AddedBook from "@/components/BookPageComponents/AddedBook/added-book";
import { fetchBookByISBN, getGoogleBookLink } from "@/lib/api/books";
import { getColorsFromImage } from "@/lib/color-finder";
import { verifyAuth } from "@/lib/auth";
import { getUserBookDb, isBookInDbByIsbn } from "@/lib/db/book";
import { ReviewsProvider } from "@/context/ReviewsContext";

export default async function BookPage({ params }) {
  const { bookISBN } = await params;

  const result = await verifyAuth();

  const bookInDb = await isBookInDbByIsbn(bookISBN);

  let userBookDb = null;

  if (bookInDb && result.user) {
    userBookDb = await getUserBookDb(bookInDb.id, result.user.id);
  }

  let fullBook = null;

  if (!bookInDb && !userBookDb) {
    const bookApi = await fetchBookByISBN(bookISBN);

    const buyLink = await getGoogleBookLink(bookISBN);

    fullBook = { ...bookApi, buy_link: buyLink };
  }

  const coverImg =
    (bookInDb ? bookInDb.image : fullBook.image) || "/default-image.png";
  const colors = await getColorsFromImage(coverImg);

  const dominantColor = colors[3];

  const bookChildren = userBookDb ? (
    <AddedBook
      book={userBookDb}
      bookColor={dominantColor}
      userId={result.user.id}
    />
  ) : (
    <UnaddedBook
      book={bookInDb ?? fullBook}
      bookColor={dominantColor}
      isUserLoggedIn={result?.user}
    />
  );

  return <ReviewsProvider>{bookChildren}</ReviewsProvider>;
}
