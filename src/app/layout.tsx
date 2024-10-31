import type { Metadata } from "next";
import "./globals.css";
import { auth } from "./api/auth/[...nextauth]/options";

export const metadata: Metadata = {
  title: "Creator Sync",
  description: "A platform for creators to sync with editors",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body>
        {session ? session.user.email : "No session"}
        {children}
      </body>
    </html>
  );
}
