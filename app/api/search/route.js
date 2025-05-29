const apiKey = process.env.ISBNDB_API_KEY;
const baseUrl = "https://api2.isbndb.com";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const page = searchParams.get("page");

  if (!q) {
    return new Response(JSON.stringify({ error: "Missing query" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    let response;

    if (q && page) {
      response = await fetch(`${baseUrl}/books/${q}?pageSize=40&page=${page}`, {
        method: "GET",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      });
    } else if (q) {
      response = await fetch(
        `${baseUrl}/books/${q}?pageSize=10&shouldMatchAll=1`,
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
      return new Response(JSON.stringify([]), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
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
