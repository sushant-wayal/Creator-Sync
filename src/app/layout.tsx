import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { Background } from "@/Components/MyComponents/Background";
import { EdgeStoreProvider } from "@/lib/edgestore";

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
      <body>
        <Toaster
          richColors={true}
          theme="light"
          position="top-center"
        />
        <SessionProvider>
          <EdgeStoreProvider>
            <Background />
            {children}
          </EdgeStoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
