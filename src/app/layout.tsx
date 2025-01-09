import { Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Global/Navbar";
import "./globals.css";
import Script from 'next/script';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      <head>
      </head>
      <body className={`${jakartaSans.className} antialiased`}>
        <Navbar /> {/* Navbar global */}
        <Script 
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="beforeInteractive"
        />
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{
            '--toastify-color-success': '#22c55e',
            '--toastify-color-error': '#ef4444',
            '--toastify-color-warning': '#f59e0b',
            '--toastify-color-info': '#3b82f6',
            '--toastify-border-radius': '1rem',
          } as React.CSSProperties}
          toastStyle={{
            borderRadius: '1rem',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            padding: '1rem',
          }}
        />
      </body>
    </html>
  );
}

