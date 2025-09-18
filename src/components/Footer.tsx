import Image from "next/image";

import Link from "next/link";

import { Container } from "./Container";

const links = [
  {
    icon: "/file.svg",
    alt: "File icon",
    href: "https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
  },
  {
    icon: "/window.svg",
    alt: "Window icon",
    href: "https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
  },
  {
    icon: "/globe.svg",
    alt: "Globe icon",
    href: "https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
  },
];

export const Footer = () => {
  return (
    <footer className="mt-auto bg-gray-800 text-white sticky bottom-0 z-10">
      <Container className="flex items-center justify-between">
        {links.map(({ href, icon, alt }) => (
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-8"
            key={href}
          >
            <Image aria-hidden src={icon} alt={alt} width={16} height={16} />
            Learn
          </Link>
        ))}
      </Container>
    </footer>
  );
};
