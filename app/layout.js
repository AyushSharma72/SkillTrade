import "./globals.css";
import Navbar from "./_components/Navbar";
import { AuthProvider } from "./_context/UserAuthContent";
import GoogleTranslator from "./_components/GoogleTranslator";
export const metadata = {
  title: "Skill Trade",
  description:
    "A platform where individuals can book services for their house, hotel, or any place",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />

          {children}
        </AuthProvider>
        <GoogleTranslator />
      </body>
    </html>
  );
}
