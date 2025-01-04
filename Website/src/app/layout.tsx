import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { Footer } from "@/Components/MyComponents/General/Footer";

export const metadata: Metadata = {
  title: "Creator Sync",
  description: "A platform for creators to sync with editors",
};

export default async function RootLayout({
  children,
  signin
}: Readonly<{
  children: React.ReactNode;
  signin: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster
          richColors={true}
          theme="light"
          position="top-center"
        />
        <SessionProvider>
          <EdgeStoreProvider>
            <div className="flex flex-col justify-between items-center gap-4 w-lvw min-h-lvh">
              {children}
              <Footer />
            </div>
            {signin}
            <div id="modal-root" />
          </EdgeStoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
