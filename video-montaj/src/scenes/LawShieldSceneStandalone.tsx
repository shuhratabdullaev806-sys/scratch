import { Composition } from "remotion";
import { LawShieldScene } from "./LawShieldScene";

export const LawShieldSceneComposition = () => {
  return (
    <Composition
      id="LawShieldScene"
      component={LawShieldScene}
      durationInFrames={179}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
