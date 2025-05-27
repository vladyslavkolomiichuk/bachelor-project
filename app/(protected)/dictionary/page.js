import Dictionary from "@/components/Dictionary/dictionary";
import Section from "@/components/GeneralComponents/Section/section";
import { verifyAuth } from "@/lib/auth";
import { getDictionaryWords } from "@/lib/db/dictionary";
import { redirect } from "next/navigation";

export default async function DictionaryPage() {
  const result = await verifyAuth();

  if (!result.user) {
    return redirect("/login");
  }

  const words = await getDictionaryWords(result.user.id);

  return (
    <Section sectionName="Dictionary">
      <Dictionary words={words} userId={result.user.id} />
    </Section>
  );
}
