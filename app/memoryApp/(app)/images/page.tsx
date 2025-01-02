import GameTitle from "@/components/game/GameTitle";
import ImagesGame from "@/components/game/images/ImagesGame";

const ImagesPage = () => {
  return (
    <div className="sm:max-w-md mx-auto">
      <GameTitle title="Images" subtitle="Memorize random images" />
      <ImagesGame />
    </div>
  );
};

export default ImagesPage;
