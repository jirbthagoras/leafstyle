import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from 'next/font/google';
import "../globals.css";

// font will be used
const jakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-plus-jakarta-sans'
});

export const metadata: Metadata = {
  title: "Greenfinity",
  description: "Greenfinity: Go Beyond The Greens",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakartaSans.className} antialiased`}
      >
        <h1>Ini ada di auth</h1>
        {children}
      </body>
    </html>
  );
}
