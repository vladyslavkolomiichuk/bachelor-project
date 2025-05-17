import UserForm from "@/components/FormComponents/UserForm/user-form";
import Section from "@/components/GeneralComponents/Section/section";
import { verifyAuth } from "@/lib/auth";
import { getFullUserInfo } from "@/lib/db/user";
import { redirect } from "next/navigation";

export default async function UserPage() {
  const result = await verifyAuth();

  if (!result.user) {
    return redirect("/login");
  }

  const user = await getFullUserInfo(result.user.id);

  return (
    <Section sectionName="Account">
      <UserForm user={user} />
    </Section>
  );
}
