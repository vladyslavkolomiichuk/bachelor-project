"use server";

import { headers } from "next/headers";

export async function getSearchBooks(query, limit, page = 1, type = "title") {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const startUrl = `${protocol}://${host}`;

  try {
    const response = await fetch(
      `${startUrl}/api/search?q=${encodeURIComponent(
        query
      )}&type=${encodeURIComponent(type)}&limit=${encodeURIComponent(
        limit
      )}&page=${encodeURIComponent(page)}`
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
