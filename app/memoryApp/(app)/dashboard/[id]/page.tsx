"use client";

import { use, useEffect, useState } from "react";
import { GameChart } from "@/components/Chart";
import getUserById from "@/actions/getUserById";
import { User } from "@prisma/client";
import { useParams } from "next/navigation";

interface ChartData {
  date: string;
  correctAnswers: number;
}

export default function Dashboard() {
  const [numbersData, setNumbersData] = useState<ChartData[]>([]);
  const [wordsData, setWordsData] = useState<ChartData[]>([]);
  const [imagesData, setImagesData] = useState<ChartData[]>([]);
  const [cardsData, setCardsData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userWithFullData, setUserWithFullData] = useState<User | undefined>(
    undefined
  );

  const params = useParams();

  useEffect(() => {
    async function fetchStats() {
      const response = await fetch(`/api/game-stats/${params.id}`);
      const data = await response.json();

      const transform = (
        data: { createdAt: string; correctAnswers: number }[] | null
      ) =>
        data
          ? data.map(({ createdAt, correctAnswers }) => ({
              date: new Date(createdAt).toLocaleString(),
              correctAnswers,
            }))
          : [];

      setNumbersData(transform(data.numbers));
      setWordsData(transform(data.words));
      setImagesData(transform(data.images));
      setCardsData(transform(data.cards));
      setIsLoading(false);
    }

    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const user = await getUserById(params.id as string);
      setUserWithFullData(user!);
    }

    fetchData();
  }, []);

  return (
    <div>
      <div className="max-w-[600px] mx-auto">
        <h1 className="mb-4 text-4xl font-black text-center border-b-black border-b-4">
          Dashboard of user: @{userWithFullData?.username}
        </h1>
        <div className="flex justify-between items-center w-full">
          <h3 className="text-lg font-bold mb-2">{`Numbers Progress`}</h3>
          <a
            href={`/memoryApp/numbers/`}
            className="text-sky-500 hover:underline"
          >
            &#8608; Train
          </a>
        </div>
        <GameChart isLoading={isLoading} data={numbersData} />
      </div>
      <div className="max-w-[600px] mx-auto">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-lg font-bold mb-2">{`Words Progress`}</h3>
          <a
            href={`/memoryApp/words/`}
            className="text-sky-500 hover:underline"
          >
            &#8608; Train
          </a>
        </div>
        <GameChart isLoading={isLoading} data={wordsData} />
      </div>
      <div className="max-w-[600px] mx-auto">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-lg font-bold mb-2">{`Images Progress`}</h3>
          <a
            href={`/memoryApp/images/`}
            className="text-sky-500 hover:underline"
          >
            &#8608; Train
          </a>
        </div>
        <GameChart isLoading={isLoading} data={imagesData} />
      </div>
      <div className="max-w-[600px] mx-auto">
        <div className="flex justify-between items-center w-full">
          <h3 className="text-lg font-bold mb-2">{`Cards Progress`}</h3>
          <a
            href={`/memoryApp/cards/`}
            className="text-sky-500 hover:underline"
          >
            &#8608; Train
          </a>
        </div>
        <GameChart isLoading={isLoading} data={cardsData} />
      </div>
    </div>
  );
}
