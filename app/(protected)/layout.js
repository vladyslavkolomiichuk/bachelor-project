import Header from "@/components/MainLayoutComponents/Header/header";
import Panel from "@/components/MainLayoutComponents/Panel/panel";
import "./protected-globals.css";
import Notifier from "@/components/Notifier/notifier";
import { UserProvider } from "@/context/UserContext";

export default function ProtectedLayout({ children }) {
  return (
    <UserProvider>
      <Notifier />
      <Header />
      <Panel />
      <main>{children}</main>
    </UserProvider>
  );
}
