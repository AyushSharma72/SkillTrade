"use client"
import "./globals.css";
import Navbar from "./_components/Navbar";
import { AuthProvider } from "./_context/UserAuthContent";
import GoogleTranslator from "./_components/GoogleTranslator";
import Chatbot from "./_components/ChatBot";



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />

          {children}
        </AuthProvider>
        {/* <GoogleTranslator /> */}
        <Chatbot />
      </body>
    </html>
  );
}
