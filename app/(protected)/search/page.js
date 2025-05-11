"use client";

import { verifyAuth } from "@/lib/auth";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default async function SearchPage() {
  const result = await verifyAuth();

  if (!result.user) {
    return redirect("/login");
  }

  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setResults(data.books || []);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (!query) {
    return <div>Please enter a search query.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (results.length === 0) {
    return <div>No results found for "{query}".</div>;
  }

  return (
    <div>
      <h1>Results for "{query}"</h1>
      <ul>
        {results.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
}
