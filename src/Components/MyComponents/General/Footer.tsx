import { websiteName } from "@/constants";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full h-10 py-3 flex justify-between px-10 items-center bg-white text-gray-600 text-sm">
      <p className="text-center">© 2025 {websiteName}. All rights reserved.</p>
      <div className="flex gap-4 justify-center items-center">
        <Link href="/termsandcondition" className="hover:underline">Terms and Condition</Link>
        <Link href="/privacy" className="hover:underline">Privacy</Link>
      </div>
    </footer>
  );
}