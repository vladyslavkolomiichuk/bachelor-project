import { ToastProvider } from "@/context/ToastContext";
import {Montserrat} from 'next/font/google'

import "./globals.css";

const montserrat = Montserrat({
  subsets: ['latin']
})

export const metadata = {
  title: "NotBook",
  description: "",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.className}>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
