import Header from "@/components/MainLayoutComponents/Header/header";
import Panel from "@/components/MainLayoutComponents/Panel/panel";
import "./globals.css";

export default function ProtectedLayout({ children }) {
  return (
    <>
      <Header />
      <Panel />
      <main>{children}</main>
    </>
  );
}
