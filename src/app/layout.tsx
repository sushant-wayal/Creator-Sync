import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { Background } from "@/Components/MyComponents/General/Background";
import { EdgeStoreProvider } from "@/lib/edgestore";

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
            {/* <Background /> */}
            {children}
            {signin}
            <div id="modal-root" />
          </EdgeStoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
