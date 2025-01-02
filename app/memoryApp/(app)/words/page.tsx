import GameTitle from "@/components/game/GameTitle";
import WordsGame from "@/components/game/words/WordsGame";

const WordsPage = () => {
  return (
    <div className="sm:max-w-md mx-auto">
      <GameTitle title="Words" subtitle="Memorize random words" />
      <WordsGame />
    </div>
  );
};

export default WordsPage;
