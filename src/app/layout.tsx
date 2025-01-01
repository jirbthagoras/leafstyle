import { Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Global/Navbar";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata = {
  title: "Leafstyle",
  description: "Healthy Lifestyle Healthy Earth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakartaSans.className} antialiased`}>
        <Navbar /> {/* Navbar global */}
        {children}
      </body>
    </html>
  );
}

