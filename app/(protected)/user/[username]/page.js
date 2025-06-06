import UserForm from "@/components/FormComponents/UserForm/user-form";
import Section from "@/components/GeneralComponents/Section/section";

export default function UserPage() {
  return (
    <Section sectionName="Account">
      <UserForm />
    </Section>
  );
}
