"use client";

import { FaSpinner } from "react-icons/fa";
import { LineChart, Line, XAxis, CartesianGrid, Tooltip } from "recharts";

interface ChartData {
  date: string;
  correctAnswers: number;
}

interface GameChartProps {
  data: ChartData[];
  isLoading: boolean;
}

export function GameChart({ data, isLoading }: GameChartProps) {
  const isEmpty = data.length === 0;

  const placeholderData = [
    { date: "Day 1", correctAnswers: 4 },
    { date: "Day 2", correctAnswers: 6 },
    { date: "Day 3", correctAnswers: 8 },
    { date: "Day 4", correctAnswers: 14 },
  ];

  return (
    <div className="relative mb-9 flex flex-col justify-center items-center">
      <div className={isEmpty || data.length < 2 ? "opacity-50 blur-[2px]" : ""}>
        <LineChart
          width={600}
          height={300}
          data={isEmpty ? placeholderData : data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <Tooltip />
          <Line type="monotone" dataKey="correctAnswers" stroke="#8884d8" />
        </LineChart>
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="bg-white bg-opacity-80 p-4 rounded-md shadow-lg">
            <p className="text-lg font-semibold">
              <FaSpinner className="animate-spin" />
            </p>
          </div>
        </div>
      )}
      {!isLoading && isEmpty || data.length < 2 && (
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="bg-white bg-opacity-80 p-4 rounded-md shadow-lg">
            <p className="text-lg font-semibold">
              Play the game to see your progress! <br />
              <i className="text-xs text-gray-600">
                (You need to play for this game for at least 2 times for
                statistics)
              </i>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
