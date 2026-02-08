import "./globals.css";
import { Montserrat } from "next/font/google";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";

const montserrat = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Track every cent spent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className}`}>
        <ReactQueryProvider>
          {children}
          <Toaster position="top-right" />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
