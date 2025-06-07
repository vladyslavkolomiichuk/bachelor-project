const apiKey = process.env.ISBNDB_API_KEY;
const baseUrl = "https://api2.isbndb.com";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const type = searchParams.get("type") || "title";
  const limit = searchParams.get("limit") || 30;
  const page = searchParams.get("page") || 1;

  if (!q) {
    return new Response(JSON.stringify({ error: "Missing query" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    let endpoint;
    let url;

    switch (type) {
      case "isbn":
        endpoint = `/book/${encodeURIComponent(q)}`;
        url = `${baseUrl}${endpoint}`;
        break;
      case "author":
        endpoint = `/author/${encodeURIComponent(q)}`;
        url = `${baseUrl}${endpoint}?pageSize=${limit}&page=${page}&shouldMatchAll=1`;
        break;
      case "title":
      default:
        endpoint = `/books/${encodeURIComponent(q)}`;
        url = `${baseUrl}${endpoint}?pageSize=${limit}&page=${page}&shouldMatchAll=1`;
        break;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      return new Response(JSON.stringify([]), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!response.ok) {
      throw new Error(`External API error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (type === "isbn") {
      const singleBook = data.book;
      const booksArray = singleBook ? [singleBook] : [];
      return new Response(JSON.stringify({ books: booksArray }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Для author або title ISBNdb повертає { books: [ ... ] }
      return new Response(JSON.stringify({ books: data.books }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error fetching from ISBNdb:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch book data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
