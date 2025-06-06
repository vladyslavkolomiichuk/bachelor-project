import ChallengesList from "@/components/ChallengesComponents/ChallengesList/challenges";
import Section from "@/components/GeneralComponents/Section/section";

export default async function ChallengesPage() {
  return (
    <Section sectionName="Challenges">
      <ChallengesList />
    </Section>
  );
}
