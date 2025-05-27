import ChallengesList from "@/components/ChallengesComponents/ChallengesList/challenges";
import Section from "@/components/GeneralComponents/Section/section";
import { verifyAuth } from "@/lib/auth";
import { getChallengesByUser } from "@/lib/db/challenge";
import { redirect } from "next/navigation";

export default async function ChallengesPage() {
  const result = await verifyAuth();

  if (!result.user) {
    return redirect("/login");
  }

  const challenges = await getChallengesByUser(result.user.id);

  return (
    <Section sectionName="Challenges">
      <ChallengesList challenges={challenges} />
    </Section>
  );
}
