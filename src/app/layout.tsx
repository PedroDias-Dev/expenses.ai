import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inconsolata = Inconsolata({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "expenses.ai",
  description: "Track and learn more about your money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inconsolata.className} bg-white`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
