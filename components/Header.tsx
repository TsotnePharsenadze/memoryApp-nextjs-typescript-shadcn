"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoExitOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RxHamburgerMenu } from "react-icons/rx";


const Header = ({ homeHref }: { homeHref: string }) => {
  const router = useRouter();
  const session = useSession();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 476);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-white flex justify-between items-center pl-4 pr-4">
      <h1
        className={`text-xl font-semibold cursor-pointer ${isMobile && "p-[8px_0_8px_0]"}`}
        onClick={() => {
          router.push(homeHref);
        }}
      >
        memoryApp 🧠
      </h1>
      <nav>
        {isMobile ? (
          <Sheet>
            <SheetTrigger>
              <RxHamburgerMenu />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>memoryApp 🧠</SheetTitle>
              </SheetHeader>
              <hr className="mt-2 mb-2" />
              <ul>
                {session?.status === "unauthenticated" && (
                  <>
                    <Link href="/memoryApp/login/">
                      <li className="hover:bg-gray-50 p-2">Login</li>
                    </Link>
                    <Link href="/memoryApp/register/">
                      <li className="hover:bg-gray-50 p-2">Register</li>
                    </Link>
                  </>
                )}
                {session?.status === "authenticated" && (
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
            </SheetContent>
          </Sheet>
        ) : (
          <ul className="flex items-center justify-center uppercase">
            {session?.status === "unauthenticated" && (
              <>
                <Link href="/memoryApp/login/">
                  <li className="hover:bg-gray-50 p-2">Login</li>
                </Link>
                <Link href="/memoryApp/register/">
                  <li className="hover:bg-gray-50 p-2">Register</li>
                </Link>
              </>
            )}
            {session?.status === "authenticated" && (
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
        )}
      </nav>
    </div>
  );
};

export default Header;
