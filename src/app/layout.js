import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Heal Link",
  description: "Your Healthcare Companion App",
  icons: {
    icon: "/image.png",
  },
};

export default function RootLayout({ children }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jakartaSans.variable} antialiased bg-gray-50 font-sans`}
      >
        {clientId ? (
          <GoogleOAuthProvider clientId={clientId}>
            {children}
          </GoogleOAuthProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
