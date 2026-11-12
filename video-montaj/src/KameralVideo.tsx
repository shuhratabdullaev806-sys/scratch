import { AbsoluteFill, Composition, Sequence, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { NameCard } from "./NameCard";
import { LiquidGlassCaption } from "./LiquidGlassCaption";
import { LawShieldScene } from "./scenes/LawShieldScene";

const FPS = 30;
const TOTAL_FRAMES = 1134; // measured source duration: 37.80s

const INSERT_FROM = 178; // 5.95s — start of the "138-modda" law citation
const INSERT_DURATION = 179; // ends 11.89s

export const KameralVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Video
        src={staticFile("kameral-tekshiruv.mp4")}
        trimBefore={0}
        durationInFrames={INSERT_FROM}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <Sequence from={INSERT_FROM} durationInFrames={INSERT_DURATION}>
        <LawShieldScene />
      </Sequence>

      <Sequence from={INSERT_FROM + INSERT_DURATION}>
        <Video
          src={staticFile("kameral-tekshiruv.mp4")}
          trimBefore={INSERT_FROM + INSERT_DURATION}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>

      <NameCard />
      <LiquidGlassCaption />
    </AbsoluteFill>
  );
};

export const KameralVideoComposition = () => {
  return (
    <Composition
      id="KameralVideo"
      component={KameralVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
