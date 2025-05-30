import Section from "@/components/GeneralComponents/Section/section";
import BooksList from "@/components/HomePageComponents/BooksList/books-list";
import { getSearchBooks } from "@/lib/search";

export default async function SearchPage({ searchParams }) {
  const { q: query } = await searchParams;

  return (
    <Section sectionName={`Search for "${query}"`}>
      <BooksList getBooks={getSearchBooks} query={query} />
    </Section>
  );
}
