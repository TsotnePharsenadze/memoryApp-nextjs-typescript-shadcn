"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Leaderboard = () => {
  return (
    <div className="w-full max-w-[1200px] mx-auto mt-20 flex flex-col gap-4">
      <h1 className="text-3xl font-black">Leaderboard</h1>
      <Tabs defaultValue="numbers">
        <TabsList className="w-full flex items-center justify-evenly overflow-hidden h-[90px] rounded-md shadow-lg pl-2 pr-2">
          <div className="w-full">
            <TabsTrigger
              value="numbers"
              className="flex flex-col justify-center items-center gap-2"
            >
              <div
                className="h-[50px] overflow-hidden rounded-md relative"
                style={{ backgroundColor: "rgba(33, 133, 208, 0.15)" }}
              >
                <img src="/pictures_of_game_modes/event_numbers.png" />
              </div>
              <h1 className="text-1xl font-black uppercase text-center">
                Numbers
              </h1>
            </TabsTrigger>
          </div>
          <div className="w-full">
            <TabsTrigger
              className="flex flex-col justify-center items-center gap-2"
              value="words"
            >
              <div
                className="h-[50px] overflow-hidden rounded-md"
                style={{ backgroundColor: "rgba(163, 51, 200, 0.15)" }}
              >
                <img src="/pictures_of_game_modes/event_words.png" />
              </div>
              <h1 className="text-1xl font-black uppercase text-center">
                Words
              </h1>
            </TabsTrigger>
          </div>
          <div className="w-full">
            <TabsTrigger
              className="flex flex-col justify-center items-center gap-2"
              value="images"
            >
              <div
                className="h-[50px] overflow-hidden rounded-md"
                style={{ backgroundColor: "rgba(251, 189, 8, 0.15)" }}
              >
                <img src="/pictures_of_game_modes/event_images.png" />
              </div>
              <h1 className="text-1xl font-black uppercase text-center">
                Images
              </h1>
            </TabsTrigger>
          </div>
          <div className="w-full">
            <TabsTrigger
              className="flex flex-col justify-center items-center gap-2"
              value="cards"
            >
              <div
                className="h-[50px] overflow-hidden rounded-md"
                style={{
                  backgroundColor: "rgba(219, 40, 40, 0.15)",
                }}
              >
                <img src="/pictures_of_game_modes/event_cards.png" />
              </div>
              <h1 className="text-1xl font-black uppercase text-center">
                Cards
              </h1>
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="numbers">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="words">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="images">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="cards">
          Make changes to your account here.
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;
