"use client";

import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

function NumbersGame() {
  const shuffleArray = (array: string[]): string[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const generateInitialNumbers = (): string[] => {
    let result: string[] = [];
    for (let i = 0; i < 10; i++) result.push(String(i));
    for (let i = 0; i < 10; i++) result.push("0" + i);
    for (let i = 10; i < 100; i++) result.push(String(i));
    return shuffleArray(result);
  };

  const shuffledList = useRef<string[]>(generateInitialNumbers());

  const [numbersToDisplay, setNumbersToDisplay] = useState<string[]>([]);
  const [amountOfNumbers, setAmountOfNumbers] = useState<number>(10);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [gameStatus, setGameStatus] = useState<number>(0);

  const [score, setScore] = useState<{ correct: number; incorrect: number }>({
    correct: 0,
    incorrect: 0,
  });

  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const [numbersUserPicked, setNumbersUserPicked] = useState<string[]>([]);

  const startGame = (e: React.FormEvent): void => {
    e.preventDefault();
    setGameStatus(1);
    setStartTime(Date.now());

    const array = shuffledList.current.slice(0, amountOfNumbers);
    setNumbersToDisplay(array);

    shuffledList.current.splice(0, amountOfNumbers);
    if (
      shuffledList.current.length <= 0 ||
      shuffledList.current.length - amountOfNumbers <= 0
    ) {
      shuffledList.current = generateInitialNumbers();
    }
  };

  const recite = (): void => {
    setGameStatus(2);
    setCurrentIndex(0);
    setEndTime(Date.now());
  };

  const generateOptions = (correctNumber: string): string[] => {
    const options = new Set<string>([correctNumber]);
    while (options.size < 9) {
      const randomNumber =
        shuffledList.current[
          Math.floor(Math.random() * shuffledList.current.length)
        ];
      options.add(randomNumber);
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (selected: string, correct: string): void => {
    setScore((prev) => ({
      correct: prev.correct + (selected === correct ? 1 : 0),
      incorrect: prev.incorrect + (selected !== correct ? 1 : 0),
    }));

    setNumbersUserPicked((prev) => [...prev, selected]);
    if (currentIndex + 1 < numbersToDisplay.length) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setGameStatus(3);
    }
  };

  const lightUpSquare = (index: number, lightUp: boolean): void => {
    const originalSequenceOfNumbers = document.querySelector(
      "#originalSequenceOfNumbers"
    ) as HTMLElement;

    if (lightUp) {
      originalSequenceOfNumbers.children[index].classList.add("text-red-800");
      originalSequenceOfNumbers.children[index].classList.remove(
        "text-green-800"
      );
    } else {
      originalSequenceOfNumbers.children[index].classList.add("text-green-800");
      originalSequenceOfNumbers.children[index].classList.remove(
        "text-red-800"
      );
    }
  };

  const resetGame = (): void => {
    setNumbersUserPicked([]);
    setGameStatus(0);
    setScore({ correct: 0, incorrect: 0 });
    setNumbersToDisplay([]);
    setCurrentIndex(0);
    setStartTime(null);
    setEndTime(null);
  };

  const handleAmountOfNumbers = (e: any) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const number = Number(value);
    if (number >= 10 && number <= 90) {
      setAmountOfNumbers(number);
    } else if (number <= 10) {
      setAmountOfNumbers(10);
    } else if (number >= 90) {
      setAmountOfNumbers(90);
    }
  };

  return (
    <div className="bg-blue-50 h-screen sm:p-6 flex flex-col items-center">
      {gameStatus === 0 && (
        <div className="bg-white p-6 shadow rounded-lg w-full max-w-md">
          <label className="block text-gray-600 mb-2">Number of items:</label>
          <select
            onChange={handleAmountOfNumbers}
            className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option>10</option>
            <option>30</option>
            <option>50</option>
            <option>70</option>
            <option>90</option>
          </select>
          <Button size="full" onClick={startGame}>
            Start Game
          </Button>
        </div>
      )}

      {gameStatus === 1 && (
        <div className="bg-white p-6 shadow rounded-lg w-full max-w-md text-center">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {numbersToDisplay.map((number, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-700 font-semibold py-2 rounded"
              >
                {number}
              </div>
            ))}
          </div>
          <Button size="full" onClick={recite}>
            Recite
          </Button>
        </div>
      )}

      {gameStatus === 2 && (
        <div className="bg-white p-6 shadow rounded-lg w-full max-w-md text-center">
          <p className="text-gray-600 mb-4">
            Question {currentIndex + 1} of {numbersToDisplay.length}
          </p>
          <p className="text-gray-800 font-semibold mb-4">
            Select the correct number:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {generateOptions(numbersToDisplay[currentIndex]).map(
              (option, i) => (
                <button
                  key={i}
                  onClick={() =>
                    handleAnswer(option, numbersToDisplay[currentIndex])
                  }
                  className="bg-gray-100 text-gray-700 py-2 rounded hover:bg-blue-200"
                >
                  {option}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {gameStatus === 3 && (
        <div className="bg-white p-6 shadow rounded-lg w-full max-w-md text-center">
          <b className="text-2xl">Game Over!</b>
          <p className="text-gray-700 mb-4 mt-2">
            <b>Correct:</b> {score.correct}, <b>Incorrect:</b> {score.incorrect}
          </p>
          <p className="text-gray-700 mb-4">
            <b>Time Taken: </b>
            {Math.round((endTime! - startTime!) / 1000)} seconds
          </p>
          <div className="mb-4">
            <p className="text-gray-700 break-words">
              <b>Your Sequence of numbers: </b>
            </p>
            <div className="flex justify-center items-center gap-2 flex-wrap max-h-[300px] overflow-y-auto">
              {numbersUserPicked.map((number, index) => (
                <span
                  key={index}
                  className={`${
                    numbersToDisplay[index] == numbersUserPicked[index]
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  } p-2 font-semibold cursor-pointer`}
                  onMouseEnter={() => lightUpSquare(index, true)}
                  onMouseLeave={() => lightUpSquare(index, false)}
                >
                  {number}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <p className="text-gray-700 break-words">
              <b>Original Sequence of numbers: </b>
            </p>
            <div
              id="originalSequenceOfNumbers"
              className="flex justify-center items-center gap-2 flex-wrap max-h-[300px] overflow-y-auto"
            >
              {numbersToDisplay.map((number, index) => (
                <span
                  key={index}
                  className="bg-green-200 text-green-800 p-2 font-semibold"
                >
                  {number}
                </span>
              ))}
            </div>
          </div>
          <Button size="full" onClick={resetGame}>
            Restart
          </Button>
        </div>
      )}
    </div>
  );
}

export default NumbersGame;
