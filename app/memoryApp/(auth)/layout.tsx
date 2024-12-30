"use client";

import Spinner from "@/components/Spinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session?.status == "authenticated") {
      router.push("/memoryApp");
    }
  }, [session?.status]);

  if (session?.status == "loading") return <Spinner />;

  if (session?.status == "authenticated") return null;

  return children;
};

export default AuthLayout;
