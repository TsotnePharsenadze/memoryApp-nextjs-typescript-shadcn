"use client";

import { useState } from "react";
import GameCard from "./GameCard";
import Spinner from "../Spinner";

const GameModes = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  if (isLoading) return <Spinner />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-center w-full max-w-[1200px] mx-auto">
      <GameCard
        imageSrc="/pictures_of_game_modes/event_numbers.png"
        imageAlt="Picture of numbers"
        title="Numbers"
        description="Memorize random numbers"
        setIsLoading={setIsLoading}
        bgColor="rgba(33, 133, 208, 0.15)"
      />
      <GameCard
        imageSrc="/pictures_of_game_modes/event_words.png"
        imageAlt="Picture of words"
        description="Memorize random words"
        title="Words"
        setIsLoading={setIsLoading}
        bgColor="rgba(163, 51, 200, 0.15)"
      />

      <GameCard
        imageSrc="/pictures_of_game_modes/event_images.png"
        imageAlt="Picture of images"
        description="Memorize random images"
        title="Images"
        setIsLoading={setIsLoading}
        bgColor="rgba(251, 189, 8, 0.15)"
      />
      <GameCard
        imageSrc="/pictures_of_game_modes/event_cards.png"
        imageAlt="Picture of cards"
        description="Memorize random cards"
        title="Cards"
        setIsLoading={setIsLoading}
        bgColor="rgba(219, 40, 40, 0.15)"
      />
    </div>
  );
};

export default GameModes;
