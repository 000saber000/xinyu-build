import { render, screen } from "@testing-library/react";
import GamesPage from "@/app/games/page";
import BreathePage from "@/app/games/breathe/page";
import StreamPage from "@/app/games/stream/page";
import GardenPage from "@/app/games/garden/page";
import { ListeningRoom } from "@/features/chat/listening-room";
import { DiaryView } from "@/features/diary/diary-view";

it.each([
  ["倾听小屋", <ListeningRoom key="chat" />, "/scenes/listening-cottage.webp"],
  ["静心花房", <GamesPage key="games" />, "/scenes/plant-greenhouse.webp"],
  ["呼吸花开", <BreathePage key="breathe" />, "/scenes/breathing-flower.webp"],
  ["心绪溪流", <StreamPage key="stream" />, "/scenes/emotion-stream.webp"],
  ["花房养成", <GardenPage key="garden" />, "/scenes/plant-greenhouse.webp"],
  ["心情日记", <DiaryView key="diary" moods={[]} diary={[]} />, "/scenes/diary-nook.webp"],
])("connects %s to its approved scene artwork", (name, view, asset) => {
  render(view);
  const region = screen.getByRole("region", { name });
  expect(region).toHaveAttribute("data-scene", asset);
  expect(region.getAttribute("style")).toContain(asset);
});
