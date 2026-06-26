// Copy to src/Root.tsx. Default format is square 1080x1080 (social feeds).
// For other ratios: 1080x1350 (4:5, more feed height), 1080x1920 (9:16,
// stories/reels), 1920x1080 (16:9, docs/embeds) — rework layouts per ratio.
import "./index.css";
import { Composition } from "remotion";
import { Pitch, SCENES } from "./Pitch";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Pitch"
        component={Pitch}
        durationInFrames={Math.round((SCENES.title + SCENES.arch + SCENES.demo) * FPS)}
        fps={FPS}
        width={1080}
        height={1080}
      />
    </>
  );
};
