import { fetchBookByISBN, getGoogleBookLink } from "@/lib/api/books";
import { getUserBookDb, isBookInDbByIsbn } from "@/lib/db/book";

export async function POST(req) {
  const { bookISBN, userId } = await req.json();

  // if (!bookISBN || !userId) {
  //   return Response.json(
  //     { error: "Missing bookISBN or userId" },
  //     { status: 400 }
  //   );
  // }

  const bookInDb = await isBookInDbByIsbn(bookISBN);  

  let userBookDb = null;
  if (bookInDb && userId) {
    userBookDb = await getUserBookDb(bookInDb.id, userId);
  }

  let fullBook = null;
  if (!bookInDb && !userBookDb) {
    const bookApi = await fetchBookByISBN(bookISBN);
    const buyLink = await getGoogleBookLink(bookISBN);
    if (bookApi) {
      fullBook = { ...bookApi, buy_link: buyLink };
    }
  }

  return Response.json({
    userBookDb,
    book: bookInDb || fullBook,
  });
}
