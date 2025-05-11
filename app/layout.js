import { ToastProvider } from "@/context/ToastContext";

import "./globals.css";

export const metadata = {
  title: "NotBook",
  description: "",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
