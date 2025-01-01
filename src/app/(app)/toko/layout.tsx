export const metadata = {
    title: "Toko - Leafstyle",
  };
  
  export default function TokoLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <body className="antialiased">{children}</body> {/* Tanpa Navbar */}
      </html>
    );
  }
  