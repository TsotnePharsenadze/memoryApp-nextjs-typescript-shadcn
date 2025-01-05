"use client";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRef, useState } from "react";
import { RxQuestionMarkCircled } from "react-icons/rx";

function ImagesGame() {
  const [imagesToDisplay, setImagesToDisplay] = useState<string[]>([]);
  const [amountOfImages, setAmountOfImages] = useState<number>(10);
  const [isLoadingImages, setIsLoadingImages] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [slideIndex, setSlideIndex] = useState<number>(1);
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const [types, setTypes] = useState<{
    nature: boolean;
    city: boolean;
    technology: boolean;
    food: boolean;
    stillife: boolean;
    abstract: boolean;
    wildlife: boolean;
  }>({
    nature: true,
    city: true,
    technology: true,
    food: true,
    stillife: true,
    abstract: true,
    wildlife: true,
  });

  const handleAmountOfImagesRef = useRef(null);

  const typesNature = useRef(null);
  const typesCity = useRef(null);
  const typesTechnology = useRef(null);
  const typesFood = useRef(null);
  const typesStillLife = useRef(null);
  const typesAbstract = useRef(null);
  const typesWildLife = useRef(null);

  const [gameStatus, setGameStatus] = useState<number>(0);
  const [score, setScore] = useState<{ correct: number; incorrect: number }>({
    correct: 0,
    incorrect: 0,
  });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [imagesUserPicked, setImagesUserPicked] = useState<string[]>([]);
  const API_KEY = process.env.NEXT_PUBLIC_API_NINJA_KEY;

  const fetchImages = async () => {
    const imagePromises = Array.from({ length: amountOfImages }, async () => {
      let url = "https://api.api-ninjas.com/v1/randomimage";
      if (
        isCustom &&
        Object.values(types).includes(true) &&
        !Object.values(types).every((value) => value == true)
      ) {
        url += "?category:";
        Object.entries(types)
          .filter(([key, value]) => value == true)
          .map(([value]) => (url += value + ", "));
      }
      const response = await fetch(url, {
        headers: {
          "X-Api-Key": API_KEY!,
          Accept: "image/jpg",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    });
    setIsLoadingImages(true);
    try {
      const fetchedImages = await Promise.all(imagePromises);
      setImagesToDisplay(fetchedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const startGame = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await fetchImages();
    setGameStatus(1);
    setStartTime(Date.now());
  };

  const recite = (): void => {
    setGameStatus(2);
    setCurrentIndex(0);
    setEndTime(Date.now());
  };

  const generateOptions = (correctImage: string): string[] => {
    const options = new Set<string>([correctImage]);
    while (options.size < Math.min(amountOfImages, 9)) {
      const randomImage =
        imagesToDisplay[Math.floor(Math.random() * imagesToDisplay.length)];
      options.add(randomImage);
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (selected: string, correct: string): void => {
    setScore((prev) => ({
      correct: prev.correct + (selected === correct ? 1 : 0),
      incorrect: prev.incorrect + (selected !== correct ? 1 : 0),
    }));
    setImagesUserPicked((prev) => [...prev, selected]);
    if (currentIndex + 1 < imagesToDisplay.length) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setGameStatus(3);
    }
  };

  const resetGame = (): void => {
    setImagesUserPicked([]);
    setGameStatus(0);
    setScore({ correct: 0, incorrect: 0 });
    setImagesToDisplay([]);
    setCurrentIndex(0);
    setStartTime(null);
    setEndTime(null);
  };

  const handleAmountOfImages = (e: any) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const number = Number(value);
    if (isCustom) {
      setAmountOfImages(Math.max(1, Math.min(500, number)));
    } else {
      setAmountOfImages(Math.max(10, Math.min(90, number)));
    }
  };

  const changeCursor = () => {
    if (slideIndex != amountOfImages) {
      setSlideIndex((pre) => pre + 1);
    }
  };

  return (
    <div className="bg-blue-50 h-screen sm:p-6 flex flex-col items-center">
      {gameStatus === 0 && !isLoadingImages && (
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
                  className="block text-gray-600 mb-2"
                >
                  Number of images:
                </label>
                <select
                  id="selectAmount"
                  onChange={handleAmountOfImages}
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
                  Number of images:{" "}
                </label>
                <input
                  id="inputAmount"
                  type="number"
                  max="110"
                  min="1"
                  value={amountOfImages}
                  ref={handleAmountOfImagesRef}
                  onChange={handleAmountOfImages}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <h1 className="text-left">
                Types of images:{" "}
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
              <div className="mb-4 grid grid-cols-3 text-left">
                <div>
                  <input
                    type="checkbox"
                    id="Nature"
                    name="typesOfImages"
                    ref={typesNature}
                    onChange={() =>
                      setTypes((prev) => ({ ...prev, nature: !prev.nature }))
                    }
                    checked={types.nature}
                  />
                  <label
                    htmlFor="Nature"
                    className=" text-gray-600 text-left ml-2"
                  >
                    Nature
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="City"
                    name="typesOfImages"
                    ref={typesCity}
                    onChange={() =>
                      setTypes((prev) => ({ ...prev, city: !prev.city }))
                    }
                    checked={types.city}
                  />
                  <label
                    htmlFor="City"
                    className=" text-gray-600 text-left ml-2"
                  >
                    City
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="Technology"
                    name="typesOfImages"
                    ref={typesTechnology}
                    onChange={() =>
                      setTypes((prev) => ({
                        ...prev,
                        technology: !prev.technology,
                      }))
                    }
                    checked={types.technology}
                  />
                  <label
                    htmlFor="Technology"
                    className=" text-gray-600 text-left ml-2"
                  >
                    Technology
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="Food"
                    name="typesOfImages"
                    ref={typesFood}
                    onChange={() =>
                      setTypes((prev) => ({ ...prev, food: !prev.food }))
                    }
                    checked={types.food}
                  />
                  <label
                    htmlFor="Food"
                    className=" text-gray-600 text-left ml-2"
                  >
                    Food
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="still_life"
                    name="typesOfImages"
                    ref={typesStillLife}
                    onChange={() =>
                      setTypes((prev) => ({
                        ...prev,
                        stillife: !prev.stillife,
                      }))
                    }
                    checked={types.stillife}
                  />
                  <label
                    htmlFor="still_life"
                    className=" text-gray-600 text-left ml-2"
                  >
                    Still life
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="Abstract"
                    name="typesOfImages"
                    ref={typesAbstract}
                    onChange={() =>
                      setTypes((prev) => ({
                        ...prev,
                        abstract: !prev.abstract,
                      }))
                    }
                    checked={types.abstract}
                  />
                  <label
                    htmlFor="Abstract"
                    className=" text-gray-600 text-left ml-2"
                  >
                    Abstract
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="Wildlife"
                    name="typesOfImages"
                    ref={typesWildLife}
                    onChange={() =>
                      setTypes((prev) => ({
                        ...prev,
                        wildlife: !prev.wildlife,
                      }))
                    }
                    checked={types.wildlife}
                  />
                  <label
                    htmlFor="Wildlife"
                    className=" text-gray-600 text-left ml-2"
                  >
                    Wildlife
                  </label>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <Button size="full" onClick={startGame}>
            Start Game
          </Button>
        </div>
      )}

      {isLoadingImages && <Spinner />}

      {gameStatus === 1 && (
        <div className="bg-white p-6 shadow rounded-lg w-full sm:max-w-md text-center">
          <div className="grid grid-cols-1 gap-4 justify-items-center mb-4">
            <Carousel className="max-w-xs ">
              <CarouselContent>
                {imagesToDisplay.map((image, index) => (
                  <CarouselItem key={index}>
                    <img
                      key={index}
                      src={image}
                      alt="Memorize this"
                      className="h-[300px] w-[300px] rounded mx-auto"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <span
                className="absolute top-1/2 traslate-y-1/2"
                style={{ left: "10px" }}
              >
                <CarouselPrevious />
              </span>
              <span
                onClick={changeCursor}
                className="absolute top-1/2 traslate-y-1/2"
                style={{ right: "10px" }}
              >
                <CarouselNext />
              </span>
            </Carousel>
          </div>

          <Button size="full" onClick={recite}>
            Recite
          </Button>
        </div>
      )}

      {gameStatus === 2 && (
        <div className="bg-white p-6 shadow rounded-lg w-full max-w-md text-center">
          <p className="text-gray-600 mb-4">
            Question {currentIndex + 1} of {imagesToDisplay.length}
          </p>
          <p className="text-gray-800 font-semibold mb-4">
            Select the correct image:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {generateOptions(imagesToDisplay[currentIndex]).map((option, i) => (
              <img
                key={i}
                src={option}
                alt="Option"
                onClick={() =>
                  handleAnswer(option, imagesToDisplay[currentIndex])
                }
                className="w-full h-auto cursor-pointer rounded hover:scale-105 transform transition"
              />
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
            <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
              {imagesUserPicked.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`User Picked ${index + 1}`}
                  className={`w-full h-auto rounded border-4 ${
                    imagesToDisplay[index] === image
                      ? "border-green-500"
                      : "border-red-500"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <p className="text-gray-700 break-words">
              <b>Original Sequence:</b>
            </p>
            <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
              {imagesToDisplay.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Original ${index + 1}`}
                  className="w-full h-auto rounded border border-gray-300"
                />
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

export default ImagesGame;
