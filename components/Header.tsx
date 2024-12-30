"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoExitOutline } from "react-icons/io5";

const Header = ({ homeHref }: { homeHref: string }) => {
  const router = useRouter();
  const session = useSession();

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
          {session?.status == "unauthenticated" && (
            <>
              <Link href="/memoryApp/login/">
                <li className="hover:bg-gray-50 p-2">Login</li>
              </Link>
              <Link href="/memoryApp/register/">
                <li className="hover:bg-gray-50 p-2">register</li>
              </Link>
            </>
          )}
          {session?.status == "authenticated" && (
            <>
              <Link href="/memoryApp/">
                <li className="hover:bg-gray-50 p-2">Disciplines</li>
              </Link>
              <Link href="/memoryApp/dashboard">
                <li className="hover:bg-gray-50 p-2">Dashboard</li>
              </Link>
              <li
                className="hover:bg-gray-50 p-2 cursor-pointer"
                onClick={() => {
                  signOut();
                }}
              >
                <IoExitOutline />
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Header;
