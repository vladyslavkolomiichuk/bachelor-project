import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserBooks, updateUserBookCategory } from "@/lib/db/book";
import { getAllNotesByUser } from "@/lib/db/note";

import Library from "@/components/Library/library";

const categories = [
  { key: "all", label: "All" },
  { key: "completed", label: "Completed" },
  { key: "in-progress", label: "In Progress" },
  { key: "not-started", label: "Not Started" },
];

export default async function LibraryPage() {
  const result = await verifyAuth();

  if (!result.user) {
    return redirect("/login");
  }

  const books = await getUserBooks(result.user.id);
  const notes = await getAllNotesByUser(result.user.id);

  const handleChangeCategory = async (bookId, category) => {
    "use server";
    await updateUserBookCategory(result.user.id, bookId, category);
  };

  return (
    <Library
      books={books}
      notes={notes}
      categories={categories}
      handleChangeCategory={handleChangeCategory}
    />
  );
}
