const apiKey = process.env.ISBNDB_API_KEY;
const baseUrl = "https://api2.isbndb.com";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const isbn = searchParams.get("isbn");
  const subject = searchParams.get("subject");
  const author = searchParams.get("author");
  const publisher = searchParams.get("publisher");
  const limit = searchParams.get("limit");
  const page = searchParams.get("page");

  if (!isbn && !subject && !author && !publisher) {
    return new Response(
      JSON.stringify({
        error: "Missing isbn or subject or author or publisher",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    let response;

    if (isbn) {
      response = await fetch(`${baseUrl}/book/${isbn}`, {
        method: "GET",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      });
    } else if (subject) {
      const pageNumber = page || Math.floor(Math.random() * 20) + 1;
      const pageSize = limit || 30;

      response = await fetch(
        `${baseUrl}/subject/${subject}?pageSize=${pageSize}&page=${pageNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: apiKey,
            "Content-Type": "application/json",
          },
        }
      );
    } else if (author) {
      const pageSize = limit || 20;

      response = await fetch(
        `${baseUrl}/author/${author}?pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            Authorization: apiKey,
            "Content-Type": "application/json",
          },
        }
      );
    } else if (publisher) {
      const pageNumber = page || Math.floor(Math.random() * 20) + 1;
      const pageSize = limit || 50;

      response = await fetch(
        `${baseUrl}/publisher/${publisher}?pageSize=${pageSize}&page=${pageNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: apiKey,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (response.status === 404) {
      return new Response(
        JSON.stringify([]),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!response.ok) {
      throw new Error(`External API error! Status: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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
