"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import getLeaderboard from "@/actions/getLeaderboard";
import { useEffect, useState } from "react";
import type {
  GameStatsWord,
  GameStatsNumber,
  GameStatsCard,
  GameStatsImage,
} from "@prisma/client";
import getUserById from "@/actions/getUserById";
import Link from "next/link";
import { getTimeTaken } from "@/lib/utils";

type GameStatsNumberAug = GameStatsNumber & {
  res: {
    id: string;
    username: string | null;
  } | null;
};

type GameStatsWordAug = GameStatsWord & {
  res: {
    id: string;
    username: string | null;
  } | null;
};
type GameStatsCardAug = GameStatsCard & {
  res: {
    id: string;
    username: string | null;
  } | null;
};
type GameStatsImageAug = GameStatsImage & {
  res: {
    id: string;
    username: string | null;
  } | null;
};

const Leaderboard = () => {
  const [leaderBoardNumbers, setLeaderBoardNumbers] = useState<
    GameStatsNumberAug[] | null
  >(null);
  const [leaderBoardWords, setLeaderBoardWords] = useState<
    GameStatsWordAug[] | null
  >(null);
  const [leaderBoardImages, setLeaderBoardImages] = useState<
    GameStatsImageAug[] | null
  >(null);
  const [leaderBoardCards, setLeaderBoardCards] = useState<
    GameStatsCardAug[] | null
  >(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const numbers = (await getLeaderboard("numbers")) as GameStatsNumber[];
        if (numbers) {
          const enrichedData = await Promise.all(
            numbers.map(async (item) => {
              const res = await getUserById(item.userId);
              return { ...item, res };
            })
          );
          setLeaderBoardNumbers(enrichedData);
        }
        const words = (await getLeaderboard("words")) as GameStatsWord[];
        if (words) {
          const enrichedData = await Promise.all(
            words.map(async (item) => {
              const res = await getUserById(item.userId);
              return { ...item, res };
            })
          );
          setLeaderBoardWords(enrichedData);
        }
        const images = (await getLeaderboard("images")) as GameStatsImage[];
        if (images) {
          const enrichedData = await Promise.all(
            images.map(async (item) => {
              const res = await getUserById(item.userId);
              return { ...item, res };
            })
          );
          setLeaderBoardImages(enrichedData);
        }
        const cards = (await getLeaderboard("cards")) as GameStatsCard[];
        if (cards) {
          const enrichedData = await Promise.all(
            cards.map(async (item) => {
              const res = await getUserById(item.userId);
              return { ...item, res };
            })
          );
          setLeaderBoardCards(enrichedData);
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full max-w-[1200px] mx-auto mt-20 flex flex-col gap-4">
      <h1 className="text-3xl font-black">Leaderboard</h1>
      <Tabs defaultValue="numbers">
        <TabsList className="w-full flex items-center justify-evenly overflow-hidden h-[90px] rounded-md shadow-lg pl-2 pr-2">
          <div className="w-full">
            <TabsTrigger
              value="numbers"
              className="flex flex-col justify-center items-center gap-2"
            >
              <div
                className="h-[50px] overflow-hidden rounded-md relative"
                style={{ backgroundColor: "rgba(33, 133, 208, 0.15)" }}
              >
                <img src="/pictures_of_game_modes/event_numbers.png" />
              </div>
              <h1 className="text-1xl font-black uppercase text-center">
                Numbers
              </h1>
            </TabsTrigger>
          </div>
          <div className="w-full">
            <TabsTrigger
              className="flex flex-col justify-center items-center gap-2"
              value="words"
            >
              <div
                className="h-[50px] overflow-hidden rounded-md"
                style={{ backgroundColor: "rgba(163, 51, 200, 0.15)" }}
              >
                <img src="/pictures_of_game_modes/event_words.png" />
              </div>
              <h1 className="text-1xl font-black uppercase text-center">
                Words
              </h1>
            </TabsTrigger>
          </div>
          <div className="w-full">
            <TabsTrigger
              className="flex flex-col justify-center items-center gap-2"
              value="images"
            >
              <div
                className="h-[50px] overflow-hidden rounded-md"
                style={{ backgroundColor: "rgba(251, 189, 8, 0.15)" }}
              >
                <img src="/pictures_of_game_modes/event_images.png" />
              </div>
              <h1 className="text-1xl font-black uppercase text-center">
                Images
              </h1>
            </TabsTrigger>
          </div>
          <div className="w-full">
            <TabsTrigger
              className="flex flex-col justify-center items-center gap-2"
              value="cards"
            >
              <div
                className="h-[50px] overflow-hidden rounded-md"
                style={{
                  backgroundColor: "rgba(219, 40, 40, 0.15)",
                }}
              >
                <img src="/pictures_of_game_modes/event_cards.png" />
              </div>
              <h1 className="text-1xl font-black uppercase text-center">
                Cards
              </h1>
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="numbers">
          <Table className="bg-white rounded-sm shadow-lg">
            <TableCaption>Refresh the page to update the list.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Correct Answers</TableHead>
                <TableHead>Time Taken</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="min-h-[52px]">
              {leaderBoardNumbers?.map((item, index) => {
                return (
                  <TableRow
                    key={index}
                    className={`${index == 0 && "bg-yellow-200"}`}
                  >
                    <TableCell className="font-medium">
                      <b>{item.correctAnswers}</b>
                    </TableCell>
                    <TableCell>
                      <b>{getTimeTaken(item.endTime, item.startTime)}</b>
                    </TableCell>
                    <TableCell>
                      <b>{new Date(item.createdAt).toLocaleString()}</b>
                    </TableCell>
                    <TableCell>
                      <b>
                        {item.res?.username} {index == 0 && "👑"}
                      </b>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild>
                        <Link href={`/profile/${item.userId}`}>
                          Visit Profile
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="words">
          <Table className="bg-white rounded-sm shadow-lg">
            <TableCaption>Refresh the page to update the list.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Correct Answers</TableHead>
                <TableHead>Time Taken</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="min-h-[52px]">
              {leaderBoardWords?.map((item, index) => {
                return (
                  <TableRow
                    key={index}
                    className={`${index == 0 && "bg-yellow-200"}`}
                  >
                    <TableCell className="font-medium">
                      <b>{item.correctAnswers}</b>
                    </TableCell>
                    <TableCell>
                      <b>{getTimeTaken(item.endTime, item.startTime)}</b>
                    </TableCell>
                    <TableCell>
                      <b>{new Date(item.createdAt).toLocaleString()}</b>
                    </TableCell>
                    <TableCell>
                      <b>
                        {item.res?.username} {index == 0 && "👑"}
                      </b>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild>
                        <Link href={`/profile/${item.userId}`}>
                          Visit Profile
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="images">
          <Table className="bg-white rounded-sm shadow-lg">
            <TableCaption>Refresh the page to update the list.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Correct Answers</TableHead>
                <TableHead>Time Taken</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="min-h-[52px]">
              {leaderBoardImages?.map((item, index) => {
                return (
                  <TableRow
                    key={index}
                    className={`${index == 0 && "bg-yellow-200"}`}
                  >
                    <TableCell className="font-medium">
                      <b>{item.correctAnswers}</b>
                    </TableCell>
                    <TableCell>
                      <b>{getTimeTaken(item.endTime, item.startTime)}</b>
                    </TableCell>
                    <TableCell>
                      <b>{new Date(item.createdAt).toLocaleString()}</b>
                    </TableCell>
                    <TableCell>
                      <b>
                        {item.res?.username} {index == 0 && "👑"}
                      </b>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild>
                        <Link href={`/profile/${item.userId}`}>
                          Visit Profile
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="cards">
          <Table className="bg-white rounded-sm shadow-lg">
            <TableCaption>Refresh the page to update the list.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Correct Answers</TableHead>
                <TableHead>Time Taken</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="min-h-[52px]">
              {leaderBoardCards?.map((item, index) => {
                return (
                  <TableRow
                    key={index}
                    className={`${index == 0 && "bg-yellow-200"}`}
                  >
                    <TableCell className="font-medium">
                      <b>{item.correctAnswers}</b>
                    </TableCell>
                    <TableCell>
                      <b>{getTimeTaken(item.endTime, item.startTime)}</b>
                    </TableCell>
                    <TableCell>
                      <b>{new Date(item.createdAt).toLocaleString()}</b>
                    </TableCell>
                    <TableCell>
                      <b>
                        {item.res?.username} {index == 0 && "👑"}
                      </b>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild>
                        <Link href={`/profile/${item.userId}`}>
                          Visit Profile
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;
