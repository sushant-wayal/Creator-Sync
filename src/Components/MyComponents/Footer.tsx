import Link from "next/link";

interface FooterProps {
  className?: string;
}

export const Footer : React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={`w-full flex justify-between items-center p-2 bg-[#333333] text-white ${className}`}
    >
      <p
        className="text-center"
      >© 2024 Creator Sync</p>
      <ul
        className="flex justify-center gap-10"
      >
        <li>
          <Link href="/privacy">Privacy Policy</Link>
        </li>
        <li>
          <Link href="/terms">Terms of Service</Link>
        </li>
        <li>
          <Link href="/contact">Contact Us</Link>
        </li>
      </ul>
    </footer>
  );
}