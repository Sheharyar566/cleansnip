import { GithubIcon, LinkedInIcon } from "@/icons";
import Link from "next/link";

const Footer = () => (
  <footer className="flex flex-row bg-secondary fixed bottom-0 min-h-12 w-full">
    <nav className="container flex gap-8 text-white justify-end items-center">
      <Link href="/attributions">Attributions</Link>
      <Link href="mailto:sheharyar566@gmail.com">Contact</Link>
      <Link href="https://github.com/sheharyar566">
        <GithubIcon />
      </Link>
      <Link href="https://github.com/sheharyar566">
        <LinkedInIcon />
      </Link>
    </nav>
  </footer>
);

export default Footer;
