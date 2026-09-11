import "./index.css";
import { MyComposition } from "./Composition";
import { VideoMontageComposition } from "./VideoMontage";
import { DemoMontageComposition } from "./DemoMontage";
import { KameralVideoComposition } from "./KameralVideo";
import { LawShieldSceneComposition } from "./scenes/LawShieldSceneStandalone";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <VideoMontageComposition />
      <DemoMontageComposition />
      <KameralVideoComposition />
      <LawShieldSceneComposition />
    </>
  );
};
