"use client";

import { useEffect, useState } from "react";
import { GameChart } from "@/components/Chart";

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

  useEffect(() => {
    async function fetchStats() {
      const response = await fetch("/api/game-stats");
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

  return (
    <div>
      <div>
        <GameChart
          isLoading={isLoading}
          data={numbersData}
          title="Numbers Progress"
        />
      </div>
      <div>
        <GameChart
          isLoading={isLoading}
          data={wordsData}
          title="Words Progress"
        />
      </div>
      <div>
        <GameChart
          isLoading={isLoading}
          data={imagesData}
          title="Images Progress"
        />
      </div>
      <div>
        <GameChart
          isLoading={isLoading}
          data={cardsData}
          title="Cards Progress"
        />
      </div>
    </div>
  );
}
