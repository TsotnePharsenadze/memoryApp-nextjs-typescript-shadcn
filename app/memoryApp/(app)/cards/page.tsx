import CardsGame from "@/components/game/cards/cardsGame";
import GameTitle from "@/components/game/GameTitle";

const CardsPage = () => {
  return (
    <div className="sm:max-w-md mx-auto">
      <GameTitle title="Cards" subtitle="Memorize random cards" />
      <CardsGame />
    </div>
  );
};

export default CardsPage;
