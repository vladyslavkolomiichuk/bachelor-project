const openLibraryUrl = "https://openlibrary.org";
const startUrl = "http://localhost:3000";

//not used
export async function fetchNewReleasedBooks(bookAmount = 12) {
  const url = `${openLibraryUrl}/search.json?q=*+language:eng&sort=new&page=100&limit=1000&fields=isbn,title,author_name,publish_date`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Open Library Error");
    const { docs: books } = await response.json();

    const todayDate = new Date();

    const filtered = books
      .filter((book) => {
        if (!book.publish_date) return false;

        const parsedDates = book.publish_date
          .map((dateStr) => new Date(dateStr))
          .filter((dateObj) => !isNaN(dateObj.getTime()));

        if (parsedDates.length === 0) return false;

        const earliestDate = new Date(
          Math.min(...parsedDates.map((d) => d.getTime()))
        );

        return earliestDate <= todayDate;
      })
      .slice(0, bookAmount)
      .map((book, index) => {
        const isbn =
          Array.isArray(book.isbn) && book.isbn.length > 0
            ? book.isbn[0]
            : null;
        return {
          id: isbn ?? `no-isbn-${index}`,
          title: book.title ?? "No title",
          authors: book.author_name?.join(", ") ?? "Unknown author",
        };
      });

    const detailed = await Promise.all(
      filtered.map(async (book) => {
        if (!book.id.startsWith("no-isbn")) {
          try {
            const res = await fetch(`${startUrl}/api/books?isbn=${book.id}`);
            if (res.ok) {
              const js = await res.json();
              const info = js.book;
              return {
                ...book,
                synopsis: info.synopsis || info.description,
                coverImage: info.image ?? null,
              };
            }
          } catch (err) {
            console.warn(`Local API error for ${book.id}:`, err);
          }
        }
        return {
          ...book,
          coverImage: null,
        };
      })
    );

    return detailed;
  } catch (error) {
    console.error("Fetch operation failed:", error);
    return [];
  }
}

export async function fetchNewSubjectBooks(bookAmount) {
  const subjects = {
    Fantasy: "FICTION Fantasy",
    "Romance Novel": "FICTION Romance",
    Thriller: "FICTION Thrillers",
    Mystery: "FICTION Mystery & Detective",
    "Young Adult": "Young Adult",
    "Children's Fiction": "Children Fiction",
    Horror: "FICTION Horror",
    "Science Fiction": "FICTION Science Fiction",
    History: "History",
    Adventure: "Adventure",
    "Health & Fitness": "HEALTH & FITNESS",
    "Literary Fiction": "FICTION Literary",
    "True Crime": "True Crime",
  };

  const keys = Object.keys(subjects);

  const randomKey = keys[Math.floor(Math.random() * keys.length)];

  const randomSubject = subjects[randomKey];

  try {
    const response = await fetch(
      `${startUrl}/api/books?subject=${encodeURIComponent(randomSubject)}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const shuffledBooks = data.books.slice().sort(() => 0.5 - Math.random());

    const randomBooks = shuffledBooks.slice(0, bookAmount);

    return { subject: randomKey, books: randomBooks };
  } catch (error) {
    console.log(error);
  }
}

export async function fetchBookByISBN(isbn) {
  try {
    

    const response = await fetch(
      `${startUrl}/api/books?isbn=${encodeURIComponent(isbn)}`
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data.book || null;
  } catch (error) {
    console.error("There was a problem with the book fetch operation:", error);
    return null;
  }
}

export async function fetchRecommendedBooksByRandom(
  type,
  availableList,
  bookAmount
) {
  if (!availableList || availableList.length === 0) {
    throw new Error("No available authors or subjects provided");
  }

  if (type !== "author" && type !== "subject") {
    throw new Error('Type must be "author" or "subject"');
  }

  const selectedItems = availableList
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const allFetchedBooks = [];

  for (const item of selectedItems) {
    try {
      const response = await fetch(
        `${startUrl}/api/books?${type}=${encodeURIComponent(item)}`
      );

      if (response.status === 404) {
        continue;
      }

      if (!response.ok) {
        console.error(`Failed to fetch books for ${type}: ${item}`);
        continue;
      }

      const data = await response.json();

      if (!data.books || !Array.isArray(data.books)) {
        console.error(`No books found for ${type}: ${item}`);
        continue;
      }

      allFetchedBooks.push(...data.books);
    } catch (error) {
      console.error(`Error fetching books for ${type}: ${item}`, error);
    }
  }

  if (allFetchedBooks.length === 0) {
    return [];
  }

  const recommendedBooks = allFetchedBooks
    .slice()
    .sort(() => 0.5 - Math.random())
    .slice(0, bookAmount);

  return recommendedBooks;
}

export async function getGoogleBookLink(isbn) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(
        isbn
      )}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from Google Books API");
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const rawLink = data.items[0].volumeInfo.infoLink;

    const bookLink = rawLink.replace("books.google.nl", "books.google.com");

    return bookLink;
  } catch (error) {
    console.error("Error getting Google Book link:", error);
    return [];
  }
}

export async function getAllBooks(limit = 50, page = 1) {
  const publishers = [
    "Penguin Random House",
    "HarperCollins",
    "Simon & Schuster",
    "Macmillan",
    "Hachette Book Group",
  ];

  const randomPublisher =
    publishers[Math.floor(Math.random() * publishers.length)];

  try {
    const response = await fetch(
      `${startUrl}/api/books?publisher=${encodeURIComponent(
        randomPublisher
      )}&limit=${encodeURIComponent(limit)}&page=${encodeURIComponent(page)}`
    );

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error("Failed to fetch all books");
    }

    const data = await response.json();

    return data.books;
  } catch (error) {
    console.error("Error fetching all books:", error);
    return [];
  }
}
