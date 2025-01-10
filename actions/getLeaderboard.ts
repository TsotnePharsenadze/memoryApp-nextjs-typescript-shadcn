"use server";

import { prisma } from "@/lib/prisma";
import {
  GameStatsNumber,
  GameStatsWord,
  GameStatsCard,
  GameStatsImage,
} from "@prisma/client";

type GameStatsType =
  | GameStatsNumber
  | GameStatsWord
  | GameStatsCard
  | GameStatsImage;

export default async function getLeaderboard(
  type: string
): Promise<GameStatsType[] | null> {
  switch (type) {
    case "numbers":
      const numbers = await prisma.gameStatsNumber.findMany({
        orderBy: [{ correctAnswers: "desc" }],
        take: 5,
      });

      return numbers.sort((a, b) => {
        const timeA =
          a.startTime && a.endTime
            ? new Date(a.endTime).getTime() - new Date(a.startTime).getTime()
            : Number.MAX_SAFE_INTEGER;
        const timeB =
          b.startTime && b.endTime
            ? new Date(b.endTime).getTime() - new Date(b.startTime).getTime()
            : Number.MAX_SAFE_INTEGER;
        return timeA - timeB;
      });

    case "cards":
      const cards = await prisma.gameStatsCard.findMany({
        orderBy: [{ correctAnswers: "desc" }],
        take: 5,
      });

      return cards.sort((a, b) => {
        const timeA =
          a.startTime && a.endTime
            ? new Date(a.endTime).getTime() - new Date(a.startTime).getTime()
            : Number.MAX_SAFE_INTEGER;
        const timeB =
          b.startTime && b.endTime
            ? new Date(b.endTime).getTime() - new Date(b.startTime).getTime()
            : Number.MAX_SAFE_INTEGER;
        return timeA - timeB;
      });

    case "words":
      const words = await prisma.gameStatsWord.findMany({
        orderBy: [{ correctAnswers: "desc" }],
        take: 5,
      });

      return words.sort((a, b) => {
        const timeA =
          a.startTime && a.endTime
            ? new Date(a.endTime).getTime() - new Date(a.startTime).getTime()
            : Number.MAX_SAFE_INTEGER;
        const timeB =
          b.startTime && b.endTime
            ? new Date(b.endTime).getTime() - new Date(b.startTime).getTime()
            : Number.MAX_SAFE_INTEGER;
        return timeA - timeB;
      });

    case "images":
      const images = await prisma.gameStatsImage.findMany({
        orderBy: [{ correctAnswers: "desc" }],
        take: 5,
      });

      return images.sort((a, b) => {
        const timeA =
          a.startTime && a.endTime
            ? new Date(a.endTime).getTime() - new Date(a.startTime).getTime()
            : Number.MAX_SAFE_INTEGER;
        const timeB =
          b.startTime && b.endTime
            ? new Date(b.endTime).getTime() - new Date(b.startTime).getTime()
            : Number.MAX_SAFE_INTEGER;
        return timeA - timeB;
      });

    default:
      return null;
  }
}
