"use client";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function WordsGame() {
  const [wordsToDisplay, setWordsToDisplay] = useState<string[]>([]);
  const [amountOfWords, setAmountOfWords] = useState<number>(10);
  const [isLoadingWords, setIsLoadingWords] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<number>(0);
  const [score, setScore] = useState<{ correct: number; incorrect: number }>({
    correct: 0,
    incorrect: 0,
  });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wordsUserPicked, setWordsUserPicked] = useState<string[]>([]);
  const API_KEY = process.env.NEXT_PUBLIC_API_NINJA_KEY;

  const fetchRandomWords = async (amount: number) => {
    setIsLoadingWords(true);
    try {
      const wordPromises = Array.from({ length: amount }, async () => {
        const response = await fetch(
          "https://api.api-ninjas.com/v1/randomword",
          {
            headers: {
              "X-Api-Key": API_KEY!,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch random word");
        }

        const data = await response.json();
        return data.word;
      });

      const fetchedWords = await Promise.all(wordPromises);
      setWordsToDisplay(fetchedWords);
    } catch (error) {
      console.error("Error fetching words:", error);
    } finally {
      setIsLoadingWords(false);
    }
  };

  const startGame = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await fetchRandomWords(amountOfWords);
    setGameStatus(1);
    setStartTime(Date.now());
  };

  const recite = (): void => {
    setGameStatus(2);
    setCurrentIndex(0);
  };

  const generateOptions = (correctWord: string): string[] => {
    const options = new Set<string>([correctWord]);
    while (options.size < 9) {
      const randomWord =
        wordsToDisplay[Math.floor(Math.random() * wordsToDisplay.length)];
      options.add(randomWord);
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (selected: string, correct: string): void => {
    setScore((prev) => ({
      correct: prev.correct + (selected === correct ? 1 : 0),
      incorrect: prev.incorrect + (selected !== correct ? 1 : 0),
    }));
    setWordsUserPicked((prev) => [...prev, selected]);
    if (currentIndex + 1 < wordsToDisplay.length) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setGameStatus(3);
      setEndTime(Date.now());
    }
  };

  const resetGame = (): void => {
    setWordsUserPicked([]);
    setGameStatus(0);
    setScore({ correct: 0, incorrect: 0 });
    setWordsToDisplay([]);
    setCurrentIndex(0);
    setStartTime(null);
    setEndTime(null);
  };

  const handleAmountOfWords = (e: any) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const number = Number(value);
    setAmountOfWords(Math.max(10, Math.min(90, number)));
  };

  return (
    <div className="bg-blue-50 h-screen sm:p-6 flex flex-col items-center">
      {gameStatus === 0 && !isLoadingWords && (
        <div className="bg-white p-6 shadow rounded-lg w-full max-w-md">
          <label className="block text-gray-600 mb-2">Number of words:</label>
          <select
            onChange={handleAmountOfWords}
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

      {isLoadingWords && <Spinner />}

      {gameStatus === 1 && (
        <div className="bg-white p-6 shadow rounded-lg w-full max-w-md text-center">
          <div className="mb-4">
            <p className="text-gray-800 font-semibold mb-4">
              Memorize these words:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {wordsToDisplay.map((word, index) => (
                <div
                  key={index}
                  className="text-xl font-semibold p-4 rounded bg-blue-200 text-center break-words"
                >
                  {word}
                </div>
              ))}
            </div>
          </div>

          <Button size="full" onClick={recite}>
            Recite
          </Button>
        </div>
      )}

      {gameStatus === 2 && (
        <div className="bg-white p-6 shadow rounded-lg w-full max-w-md text-center">
          <p className="text-gray-600 mb-4">
            Question {currentIndex + 1} of {wordsToDisplay.length}
          </p>
          <p className="text-gray-800 font-semibold mb-4">
            Select the correct word:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {generateOptions(wordsToDisplay[currentIndex]).map((option, i) => (
              <button
                key={i}
                onClick={() =>
                  handleAnswer(option, wordsToDisplay[currentIndex])
                }
                className="w-full h-auto cursor-pointer rounded bg-gray-100 hover:bg-gray-200 p-4 text-xl break-words"
              >
                {option}
              </button>
            ))}
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
            <b>Time Taken:</b> {Math.round((endTime! - startTime!) / 1000)}{" "}
            seconds
          </p>
          <div className="mb-4">
            <p className="text-gray-700 break-words">
              <b>Your Sequence:</b>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {wordsUserPicked.map((word, index) => (
                <div
                  key={index}
                  className={`text-xl font-semibold p-4 rounded break-words ${
                    wordsToDisplay[index] === word
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <p className="text-gray-700 break-words">
              <b>Original Sequence:</b>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {wordsToDisplay.map((word, index) => (
                <div
                  key={index}
                  className="text-xl font-semibold p-4 rounded bg-blue-200 text-center  break-words"
                >
                  {word}
                </div>
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

export default WordsGame;
