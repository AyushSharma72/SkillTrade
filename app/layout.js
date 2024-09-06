import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/Navbar";

// Import Inter font from Google Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Skill Trade",
  description:
    "A platform where individuals can book services for their house, hotel, or any place",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable}   antialiased`}
        style={{ fontFamily: "Inter, Helvetica, sans-serif" }} // Set the global font family
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
