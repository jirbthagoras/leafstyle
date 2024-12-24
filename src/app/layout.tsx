import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from 'next/font/google';
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-plus-jakarta-sans'
});

export const metadata: Metadata = {
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
      <body
        className={`${jakartaSans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
