const apiKey = process.env.ISBNDB_API_KEY;
const baseUrl = "https://api2.isbndb.com";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const limit = searchParams.get("limit");
  const page = searchParams.get("page");

  if (!q) {
    return new Response(JSON.stringify({ error: "Missing query" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    let response;

    if (q) {
      const pageNumber = page || 1;
      const pageSize = limit || 30;

      response = await fetch(
        `${baseUrl}/books/${q}?pageSize=${pageSize}&page=${pageNumber}&shouldMatchAll=1`,
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
