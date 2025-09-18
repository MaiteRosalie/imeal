import Image from "next/image";
import Link from "next/link";

import { Container } from "./Container";

export const Header = () => {
  return (
    <header className="border-b border-gray-300 sticky top-0 bg-white z-10">
      <Container className="flex items-center justify-between gap-2">
        <Link href="/">
          <Image
            src="/next.svg"
            alt="imeal logo"
            width={120}
            height={38}
            priority
          />
        </Link>

        <nav className="flex justify-between w-72 items-center">
          <div className="h-4 w-[2px] border-r border-gray-300"></div>
          <Link href="/">Recipes</Link>
          <Link href="/calendar">Calendar</Link>
          <Link href="/groceries">Groceries</Link>
        </nav>
      </Container>
    </header>
  );
};
