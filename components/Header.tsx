"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = ({ homeHref }: { homeHref: string }) => {
  const router = useRouter();
  return (
    <div className="bg-white flex justify-between items-center pl-4 pr-4">
      <h1
        className="text-xl font-semibold cursor-pointer"
        onClick={() => {
          router.push(homeHref);
        }}
      >
        memoryApp 🧠
      </h1>
      <nav>
        <ul className="flex items-center justify-center uppercase">
          <Link href="/memoryApp/login/">
            <li className="hover:bg-gray-50 p-2">Login</li>
          </Link>
          <Link href="/memoryApp/register/">
            <li className="hover:bg-gray-50 p-2">register</li>
          </Link>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
