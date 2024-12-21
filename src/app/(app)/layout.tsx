import "../globals.css";
import Navbar from "@/components/Global/Navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <>

            <Navbar/>
            {children}

        </>

  );
}
