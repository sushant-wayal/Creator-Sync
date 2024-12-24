import type { Metadata } from "next";
import "../globals.css";
import { PublicNavbar } from "@/Components/MyComponents/General/PublicNavbar";

export const metadata: Metadata = {
  title: "Creator Sync | Auth"
};

export default async function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <PublicNavbar/>
      {children}
    </>
  );
}
