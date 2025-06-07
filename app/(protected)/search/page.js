import Section from "@/components/GeneralComponents/Section/section";
import BooksList from "@/components/HomePageComponents/BooksList/books-list";
import { getSearchBooks } from "@/lib/search";

export default async function SearchPage({ searchParams }) {
  let { q: query } = await searchParams;
  query = query.trim();

  if (query.startsWith("a:")) {
    query = query.slice(2).trim();
  } else if (query.startsWith("isbn:")) {
    query = query.slice(5).trim();
  }

  return (
    <Section sectionName={`Search for "${query}"`}>
      <BooksList getBooks={getSearchBooks} query={query} />
    </Section>
  );
}
