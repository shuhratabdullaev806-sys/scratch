import { AbsoluteFill, Composition, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

const FPS = 30;

export const VideoMontage: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries name="Video timeline">
        <TransitionSeries.Sequence name="Clip 1" durationInFrames={90}>
          <Video src={staticFile("clip1.mp4")} trimBefore={0} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: 15 })}
          presentation={fade()}
        />

        <TransitionSeries.Sequence name="Clip 2" durationInFrames={90}>
          <Video src={staticFile("clip2.mp4")} trimBefore={0} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          timing={linearTiming({ durationInFrames: 15 })}
          presentation={fade()}
        />

        <TransitionSeries.Sequence name="Clip 3" durationInFrames={90}>
          <Video src={staticFile("clip3.mp4")} trimBefore={0} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

export const VideoMontageComposition = () => {
  return (
    <Composition
      id="VideoMontage"
      component={VideoMontage}
      durationInFrames={90 + 90 + 90 - 15 - 15}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
