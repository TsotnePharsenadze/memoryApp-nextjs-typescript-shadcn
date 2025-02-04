"use client";

import GameModes from "@/components/game/GameModes";
import Leaderboard from "@/components/Leaderboard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.status == "authenticated") {
      router.push("/memoryApp/");
    }
  }, [session, router]);

  return (
    <div>
      <GameModes />
      <Leaderboard />
    </div>
  );
}
