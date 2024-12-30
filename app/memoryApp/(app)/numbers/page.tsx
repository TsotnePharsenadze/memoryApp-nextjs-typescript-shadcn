import GameTitle from "@/components/game/GameTitle";
import NumbersGame from "@/components/game/numbers/NumbersGame";

const NumbersPage = () => {
  return (
    <div className="max-w-md mx-auto">
      <GameTitle title="Numbers" subtitle="Memorize random numbers" />
      <NumbersGame />
    </div>
  );
};

export default NumbersPage;
