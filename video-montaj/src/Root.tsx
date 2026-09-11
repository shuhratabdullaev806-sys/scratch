import "./index.css";
import { MyComposition } from "./Composition";
import { VideoMontageComposition } from "./VideoMontage";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <VideoMontageComposition />
    </>
  );
};
