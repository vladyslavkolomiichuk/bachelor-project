import Section from "@/components/GeneralComponents/Section/section";
import UserTest from "@/components/UserTest/user-test";
import { verifyAuth } from "@/lib/auth";
import { saveTestResult } from "@/lib/db/test";
import { redirect } from "next/navigation";

export default async function TestPage() {
  const result = await verifyAuth();

  if (!result.user) {
    return redirect("/login");
  }

  const userId = result?.user?.id;

  const handleSave = async (wpm, comprehension, time) => {
    "use server";
    await saveTestResult(userId, wpm, comprehension, time);
  };

  return (
    <Section sectionName="Reading Speed Test">
      <UserTest saveResult={handleSave} />
    </Section>
  );
}
