import "./index.css";
import { MyComposition } from "./Composition";
import { VideoMontageComposition } from "./VideoMontage";
import { DemoMontageComposition } from "./DemoMontage";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <VideoMontageComposition />
      <DemoMontageComposition />
    </>
  );
};
