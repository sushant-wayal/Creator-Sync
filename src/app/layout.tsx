import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/Components/MyComponents/NavBar";
import { Footer } from "@/Components/MyComponents/Footer";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Creator Sync",
  description: "A platform for creators to sync with editors",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="bg-[#222222]"
      >
        <Toaster
          richColors={true}
          theme="light"
          position="top-center"
        />
        <SessionProvider>
          <NavBar />
          {children}
          {/* <Footer /> */}
        </SessionProvider>
      </body>
    </html>
  );
}
