"use client";

import Spinner from "@/components/Spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { FaSpinner } from "react-icons/fa";

function WordsGame() {
  const [wordsToDisplay, setWordsToDisplay] = useState<string[]>([]);
  const [amountOfWords, setAmountOfWords] = useState<number>(10);
  const [isLoadingWords, setIsLoadingWords] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [inGroupsOf, setInGroupsOf] = useState<number>(1);

  const inGroupsOfRef = useRef(null);

  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [types, setTypes] = useState<{
    noun: boolean;
    adverb: boolean;
    adjective: boolean;
    verb: boolean;
  }>({
    noun: true,
    adverb: true,
    adjective: true,
    verb: true,
  });

  const [gameStatus, setGameStatus] = useState<number>(0);
  const [score, setScore] = useState<{ correct: number; incorrect: number }>({
    correct: 0,
    incorrect: 0,
  });

  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wordsUserPicked, setWordsUserPicked] = useState<string[]>([]);

  const amountOfWordsRef = useRef(null);
  const typesNoun = useRef(null);
  const typesAdverb = useRef(null);
  const typesAdjective = useRef(null);
  const typesVerb = useRef(null);

  const API_KEY = process.env.NEXT_PUBLIC_API_NINJA_KEY;

  const groupWords = () => {
    const groupedWords = [];
    for (let i = 0; i < amountOfWords; i += inGroupsOf) {
      groupedWords.push(wordsToDisplay.slice(i, i + inGroupsOf).join(" & \n "));
    }
    return groupedWords;
  };

  const fetchRandomWords = async (amount: number) => {
    setIsLoadingWords(true);
    try {
      const wordPromises = Array.from({ length: amount }, async () => {
        let url = "https://api.api-ninjas.com/v1/randomword";
        if (
          isCustom &&
          Object.values(types).includes(true) &&
          !Object.values(types).every((value) => value == true)
        ) {
          url += "?type:";
          Object.entries(types)
            .filter(([, value]) => value == true)
            .map(([value]) => {
              url += value + ", ";
            });
        }
        const response = await fetch(url, {
          headers: {
            "X-Api-Key": API_KEY!,
          },
        });

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
    setEndTime(Date.now());
  };

  const generateOptions = (correctWord: string): string[] => {
    const options = new Set<string>([correctWord]);
    while (options.size < Math.min(amountOfWords, 4)) {
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
    }
  };

  const resetGame = async (): Promise<void> => {
    setIsLoading(true);
    await fetch("/api/game/word/", {
      method: "POST",
      body: JSON.stringify({
        wordsUserPicked,
        gameStatus,
        correctAnswers: score.correct,
        incorrectAnswers: score.incorrect,
        wordsToDisplay,
        currentIndex,
        endTime,
        startTime,
        isCustom,
      }),
    });
    setIsLoading(false);
    setWordsUserPicked([]);
    setGameStatus(0);
    setScore({ correct: 0, incorrect: 0 });
    setWordsToDisplay([]);
    setCurrentIndex(0);
    setStartTime(null);
    setEndTime(null);
  };

  const handleAmountOfWords = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const number = Number(value);
    if (!isCustom) {
      setAmountOfWords(Math.max(10, Math.min(90, number)));
    } else {
      setAmountOfWords(Math.max(1, Math.min(500, number)));
    }
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const number = Number(value);
    if ([1, 2, 3, 4, 5, 6].includes(number)) {
      setInGroupsOf(number);
    }
  };

  return (
    <div className="bg-blue-50 h-screen sm:p-6 flex flex-col items-center">
      {gameStatus === 0 && !isLoadingWords && (
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
                  htmlFor="selectAmount"
                  className="block text-gray-600 mb-2 text-left"
                >
                  Number of words:
                </label>
                <select
                  id="selectAmount"
                  onChange={handleAmountOfWords}
                  className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option>10</option>
                  <option>30</option>
                  <option>50</option>
                  <option>70</option>
                  <option>90</option>
                </select>
              </div>
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
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                </select>
              </div>
            </TabsContent>
            <TabsContent value="custom">
              <div className="mb-4">
                <label
                  className="block text-gray-600 mb-2 text-left"
                  htmlFor="inputAmount"
                >
                  Number of words:{" "}
                </label>
                <input
                  id="inputAmount"
                  type="number"
                  max="110"
                  min="1"
                  value={amountOfWords}
                  ref={amountOfWordsRef}
                  onChange={handleAmountOfWords}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
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
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                </select>
              </div>
              <h1 className="text-left">
                Types of words:{" "}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <RxQuestionMarkCircled />
                    </TooltipTrigger>
                    <TooltipContent>
                      <i className="text-xs text-gray-200">
                        {" "}
                        Not selecting either will be counted as selecting all
                      </i>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h1>

              <div className="mb-4 flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="Nouns"
                  name="typeOfWords"
                  ref={typesNoun}
                  onChange={() =>
                    setTypes((prev) => ({ ...prev, noun: !prev.noun }))
                  }
                  checked={types.noun}
                />
                <label
                  htmlFor="Nouns"
                  className="block text-gray-600 text-left relative"
                >
                  Nouns
                </label>{" "}
                <input
                  type="checkbox"
                  id="Verbs"
                  name="typeOfWords"
                  ref={typesVerb}
                  onChange={() =>
                    setTypes((prev) => ({ ...prev, verb: !prev.verb }))
                  }
                  checked={types.verb}
                />
                <label
                  htmlFor="Verbs"
                  className="block text-gray-600 text-left relative"
                >
                  Verbs
                </label>{" "}
                <input
                  type="checkbox"
                  id="Adjectives"
                  name="typeOfWords"
                  ref={typesAdjective}
                  onChange={() =>
                    setTypes((prev) => ({
                      ...prev,
                      adjective: !prev.adjective,
                    }))
                  }
                  checked={types.adjective}
                />
                <label
                  htmlFor="Adjectives"
                  className="block text-gray-600 text-left relative"
                >
                  Adjectives
                </label>{" "}
                <input
                  type="checkbox"
                  id="Adverbs"
                  name="typeOfWords"
                  ref={typesAdverb}
                  onChange={() =>
                    setTypes((prev) => ({ ...prev, adverb: !prev.adverb }))
                  }
                  checked={types.adverb}
                />
                <label
                  htmlFor="Adverbs"
                  className="block text-gray-600 text-left relative"
                >
                  Adverbs
                </label>
              </div>
            </TabsContent>
          </Tabs>
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
              {groupWords().map((word, index) => (
                <div
                  key={index}
                  className="text-xl font-semibold p-2 rounded bg-blue-200 text-center break-words"
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

export default WordsGame;
