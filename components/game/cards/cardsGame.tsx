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
import Image from "next/image";
import { useState } from "react";

const imagePaths = [
  "2C.svg",
  "2D.svg",
  "2H.svg",
  "2S.svg",
  "3C.svg",
  "3D.svg",
  "3H.svg",
  "3S.svg",
  "4C.svg",
  "4D.svg",
  "4H.svg",
  "4S.svg",
  "5C.svg",
  "5D.svg",
  "5H.svg",
  "5S.svg",
  "6C.svg",
  "6D.svg",
  "6H.svg",
  "6S.svg",
  "7C.svg",
  "7D.svg",
  "7H.svg",
  "7S.svg",
  "8C.svg",
  "8D.svg",
  "8H.svg",
  "8S.svg",
  "9C.svg",
  "9D.svg",
  "9H.svg",
  "9S.svg",
  "AC.svg",
  "AD.svg",
  "AH.svg",
  "AS.svg",
  "JC.svg",
  "JD.svg",
  "JH.svg",
  "JS.svg",
  "KC.svg",
  "KD.svg",
  "KH.svg",
  "KS.svg",
  "QC.svg",
  "QD.svg",
  "QH.svg",
  "QS.svg",
  "TC.svg",
  "TD.svg",
  "TH.svg",
  "TS.svg",
];

function CardsGame() {
  const [imagesToDisplay, setImagesToDisplay] = useState<string[]>([]);
  const [amountOfImages, setAmountOfImages] = useState<number>(10);
  const [isLoadingImages, setIsLoadingImages] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [slideIndex, setSlideIndex] = useState<number>(1);
  const [gameStatus, setGameStatus] = useState<number>(0);
  const [score, setScore] = useState<{ correct: number; incorrect: number }>({
    correct: 0,
    incorrect: 0,
  });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [imagesUserPicked, setImagesUserPicked] = useState<string[]>([]);

  const loadImages = () => {
    setIsLoadingImages(true);
    try {
      const selectedImages = [];
      for (let i = 0; i < amountOfImages; i++) {
        const randomImage =
          imagePaths[Math.floor(Math.random() * imagePaths.length)];
        selectedImages.push(`/cards/${randomImage}`);
      }

      setImagesToDisplay(selectedImages);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const startGame = (e: React.FormEvent): void => {
    e.preventDefault();
    loadImages();
    setGameStatus(1);
    setStartTime(Date.now());
  };

  const recite = (): void => {
    setGameStatus(2);
    setCurrentIndex(0);
  };

  const generateOptions = (correctImage: string): string[] => {
    const options = new Set<string>([correctImage]);
    while (options.size < 9) {
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
      setEndTime(Date.now());
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
    setAmountOfImages(Math.max(10, Math.min(90, number)));
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
          <label className="block text-gray-600 mb-2">Number of items:</label>
          <select
            onChange={handleAmountOfImages}
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

      {isLoadingImages && <Spinner />}

      {gameStatus === 1 && (
        <div className="bg-white p-6 shadow rounded-lg w-full sm:max-w-md text-center">
          <div className="grid grid-cols-1 gap-4 justify-items-center mb-4">
            <Carousel className="max-w-xs ">
              <CarouselContent>
                {imagesToDisplay.map((image, index) => (
                  <CarouselItem key={index}>
                    <Image
                      key={index}
                      src={image}
                      width={230}
                      height={230}
                      alt="Memorize this"
                      className=" rounded mx-auto"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <span onClick={changeCursor}>
                <CarouselNext />
              </span>
            </Carousel>
          </div>

          <Button
            size="full"
            onClick={recite}
            disabled={slideIndex != amountOfImages}
          >
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

export default CardsGame;
