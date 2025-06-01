import { ToastProvider } from "@/context/ToastContext";
import { ConfirmProvider } from "@/context/ConfirmContext";
import { Montserrat } from "next/font/google";

import { Next13NProgress } from "nextjs13-progress";

import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
});

export const metadata = {
  title: "NotBook",
  description: "",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.style}>
      <body>
        <Next13NProgress
          color="#f2f2f3"
          height={2}
          options={{ showSpinner: false }}
        />
        <ToastProvider>
          <ConfirmProvider>{children}</ConfirmProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
