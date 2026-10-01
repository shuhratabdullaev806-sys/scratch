import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import { ENDCARD, EndCard } from "./EndCard";
import { DURATION_S, FPS, HEIGHT, WIDTH } from "./timeline";

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="Quiz"
    component={Main}
    durationInFrames={Math.round(DURATION_S * FPS)}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
  <Composition
    id="EndCard"
    component={EndCard}
    durationInFrames={Math.round(ENDCARD.hold * FPS)}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
  </>
);
