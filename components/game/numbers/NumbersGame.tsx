"use client";

import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaSpinner } from "react-icons/fa";

function NumbersGame() {
  const randomInRangeNumberGenerator = (min: number, max: number) => {
    const randomNumber = new Set<string>();

    while (max !== 0) {
      const randomNum = Math.floor(Math.random() * (max - min + 1) + min)
        .toString()
        .padStart(String(max).length, "0");
      randomNumber.add(randomNum);
      max = Number(String(max).slice(0, String(max).length - 1));
    }

    const shuffledNumbers = Array.from(randomNumber).sort(
      () => Math.random() - 0.5
    );
    return shuffledNumbers[0];
  };

  const randomInGroupNumberGenerator = (amount: number) => {
    let number = "";
    for (let i = 0; i < amount; i++) {
      number += Math.floor(Math.random() * 10);
    }
    return number;
  };

  const [inGroupsOf, setInGroupsOf] = useState<number>(2);
  const [inRangeOf, setInRangeOf] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inGroupsOfRef = useRef(null);
  const inRangeOfRef = useRef(null);

  const [isInRangeOf, setIsInRangeOf] = useState<boolean>(true);

  const [numbersToDisplay, setNumbersToDisplay] = useState<string[]>([]);
  const [amountOfNumbers, setAmountOfNumbers] = useState<number>(10);
  const amountOfNumbersRef = useRef(null);

  const [isCustom, setIsCustom] = useState<boolean>(false);

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

    const newNumbers: string[] = [];

    if (isCustom) {
      if (isInRangeOf) {
        const max =
          inRangeOf == 2
            ? 99
            : inRangeOf == 3
            ? 999
            : inRangeOf == 4
            ? 9999
            : inRangeOf == 5
            ? 99999
            : inRangeOf == 6
            ? 999999
            : 99;
        for (let i = 0; i < amountOfNumbers; i++) {
          newNumbers.push(randomInRangeNumberGenerator(0, max));
        }
      } else {
        for (let i = 0; i < amountOfNumbers; i++) {
          newNumbers.push(randomInGroupNumberGenerator(inGroupsOf));
        }
      }
    } else {
      for (let i = 0; i < amountOfNumbers; i++) {
        newNumbers.push(randomInRangeNumberGenerator(0, 99));
      }
    }

    setNumbersToDisplay(newNumbers);
  };

  const recite = (): void => {
    setGameStatus(2);
    setCurrentIndex(0);
    setEndTime(Date.now());
  };

  const generateOptions = (correctNumber: string): string[] => {
    const uniqueNumbers = new Set(numbersToDisplay);
    uniqueNumbers.add(correctNumber);
  
    const maxOptions = Math.min(amountOfNumbers, uniqueNumbers.size, 9);
    const options = new Set<string>([correctNumber]);
  
    const available = Array.from(uniqueNumbers).filter((n) => n !== correctNumber);
  
    while (options.size < maxOptions && available.length) {
      const randomIndex = Math.floor(Math.random() * available.length);
      options.add(available.splice(randomIndex, 1)[0]);
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

    if (
      originalSequenceOfNumbers &&
      originalSequenceOfNumbers.children[index]
    ) {
      if (lightUp) {
        originalSequenceOfNumbers.children[index].classList.add("text-red-800");
        originalSequenceOfNumbers.children[index].classList.remove(
          "text-green-800"
        );
      } else {
        originalSequenceOfNumbers.children[index].classList.add(
          "text-green-800"
        );
        originalSequenceOfNumbers.children[index].classList.remove(
          "text-red-800"
        );
      }
    }
  };

  const resetGame = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await fetch("/api/game/number/", {
        method: "POST",
        body: JSON.stringify({
          numbersUserPicked,
          gameStatus,
          correctAnswers: score.correct,
          incorrectAnswers: score.incorrect,
          numbersToDisplay,
          currentIndex,
          endTime,
          startTime,
          isCustom,
        }),
      });
    } catch (error) {
      console.error("Error saving game data:", error);
    }
    setIsLoading(false);
    setNumbersUserPicked([]);
    setGameStatus(0);
    setScore({ correct: 0, incorrect: 0 });
    setNumbersToDisplay([]);
    setCurrentIndex(0);
    setStartTime(null);
    setEndTime(null);
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const number = Number(value);
    if ([2, 3, 4, 5, 6].includes(number)) {
      setInGroupsOf(number);
    }
  };

  const handleInRangeOf = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const number = Number(value);
    if ([2, 3, 4, 5, 6].includes(number)) {
      setInRangeOf(number);
    }
  };

  const handleAmountOfNumbers = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const number = Number(value);
    if (isCustom) {
      if (number > 0 && number <= 10000) {
        setAmountOfNumbers(number);
      } else if (number <= 0) {
        setAmountOfNumbers(1);
      } else if (number >= 10000) {
        setAmountOfNumbers(10000);
      }
    } else {
      if (number >= 10 && number <= 90) {
        setAmountOfNumbers(number);
      } else if (number <= 10) {
        setAmountOfNumbers(10);
      } else if (number >= 90) {
        setAmountOfNumbers(90);
      }
    }
  };
  return (
    <div className="bg-blue-50 h-screen sm:p-6 flex flex-col items-center">
      {gameStatus === 0 && (
        <div className="bg-white p-6 shadow rounded-lg w-full max-w-md">
          <Tabs
            defaultValue={`${isCustom ? "custom" : "leaderboard"}`}
            className="w-full text-center"
          >
            <TabsList>
              <TabsTrigger
                value="leaderboard"
                onClick={() => setIsCustom(false)}
              >
                for Leaderboard
              </TabsTrigger>
              <TabsTrigger value="custom" onClick={() => setIsCustom(true)}>
                Custom
              </TabsTrigger>
            </TabsList>
            <TabsContent value="leaderboard">
              <div>
                <label
                  className="block text-gray-600 mb-2 text-left"
                  htmlFor="selectAmount"
                >
                  Number of unique items
                  <i className="text-xs text-gray-400"> (00-09, 0-9, 10-99)</i>:
                </label>
                <select
                  id="selectAmount"
                  onChange={handleAmountOfNumbers}
                  className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option>10</option>
                  <option>30</option>
                  <option>50</option>
                  <option>70</option>
                  <option>90</option>
                </select>
              </div>
            </TabsContent>
            <TabsContent value="custom">
              <div className="mb-4">
                <label
                  className="block text-gray-600 mb-2 text-left"
                  htmlFor="inputAmount"
                >
                  Number of items
                  <i className="text-xs text-gray-400"> (00-09, 0-9, 10-99)</i>:
                </label>
                <input
                  id="inputAmount"
                  type="number"
                  max="110"
                  min="1"
                  value={amountOfNumbers}
                  ref={amountOfNumbersRef}
                  onChange={handleAmountOfNumbers}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <Tabs
                defaultValue={`${isInRangeOf ? "range" : "groups"}`}
                className="border-black-100 shadow-sm border-2 mb-2 rounded-md p-2"
              >
                <TabsList>
                  <TabsTrigger
                    onClick={() => setIsInRangeOf(false)}
                    value="groups"
                  >
                    In groups
                  </TabsTrigger>
                  <span className="text-black pl-2 pr-2 text-xs font-black border-l-[1px] border-black border-r-[1px] m-2">
                    OR
                  </span>
                  <TabsTrigger
                    onClick={() => setIsInRangeOf(true)}
                    value="range"
                  >
                    In range
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="groups">
                  <div>
                    <label
                      className="block text-gray-600 mb-2 text-left"
                      htmlFor="inGroupsOf"
                    >
                      In groups of:
                    </label>
                    <select
                      id="inGroupsOF"
                      onChange={handleGroupChange}
                      className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      ref={inGroupsOfRef}
                      value={inGroupsOf}
                    >
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                    </select>
                  </div>
                </TabsContent>
                <TabsContent value="range">
                  <div>
                    <label
                      className="block text-gray-600 mb-2 text-left"
                      htmlFor="inRangeOf"
                    >
                      In range:
                    </label>
                    <select
                      id="inRangeOf"
                      onChange={handleInRangeOf}
                      value={inRangeOf}
                      ref={inRangeOfRef}
                      className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="2">00-99</option>
                      <option value="3">000-999 (includes 00-99)</option>
                      <option value="4">
                        0000-9999 (includes 00-99, 000-999)
                      </option>
                      <option value="5">
                        00000-99999 (includes all above)
                      </option>
                      <option value="6">
                        000000-999999 (includes all above)
                      </option>
                    </select>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
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
            {isLoading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Save and Restart"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default NumbersGame;
