import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Import Inter font
import "./globals.css";
import { ThemeProvider } from "./contexts/theme-context"; // Import ThemeProvider

const inter = Inter({ subsets: ["latin"] }); // Initialize Inter font

export const metadata: Metadata = {
  title: "Mini Seller Console",
  description: "A challenge project for CoverPin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Apply the Inter font class to the body */}
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body> 
    </html>
  );
}