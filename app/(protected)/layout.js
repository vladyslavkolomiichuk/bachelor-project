import Header from "@/components/MainLayoutComponents/Header/header";
import Panel from "@/components/MainLayoutComponents/Panel/panel";
import "./protected-globals.css";
import Notifier from "@/components/Notifier/notifier";
import { verifyAuth } from "@/lib/auth";

export default async function ProtectedLayout({ children }) {
  const result = await verifyAuth();

  if (!result.user) {
    return redirect("/login");
  }

  const userId = result.user.id;
  return (
    <>
      <Notifier userId={userId} />
      <Header />
      <Panel />
      <main>{children}</main>
    </>
  );
}
