import { AbsoluteFill, Composition, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

const FPS = 30;

const Scene: React.FC<{ label: string; color: string; sublabel: string }> = ({
  label,
  color,
  sublabel,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, 15], [0.85, 1], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(
    frame,
    [0, 15, durationInFrames - 15, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          textAlign: "center",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        <div style={{ fontSize: 90, fontWeight: 800 }}>{label}</div>
        <div style={{ fontSize: 34, marginTop: 16, opacity: 0.85 }}>
          {sublabel}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const DemoMontage: React.FC = () => {
  return (
    <TransitionSeries name="Demo timeline">
      <TransitionSeries.Sequence name="Clip 1" durationInFrames={75}>
        <Scene label="Klip 1" sublabel="clip1.mp4 o'rnini bosadi" color="#2563eb" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        timing={linearTiming({ durationInFrames: 15 })}
        presentation={fade()}
      />

      <TransitionSeries.Sequence name="Clip 2" durationInFrames={75}>
        <Scene label="Klip 2" sublabel="clip2.mp4 o'rnini bosadi" color="#059669" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        timing={linearTiming({ durationInFrames: 15 })}
        presentation={slide()}
      />

      <TransitionSeries.Sequence name="Clip 3" durationInFrames={75}>
        <Scene label="Klip 3" sublabel="clip3.mp4 o'rnini bosadi" color="#dc2626" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

export const DemoMontageComposition = () => {
  return (
    <Composition
      id="DemoMontage"
      component={DemoMontage}
      durationInFrames={75 + 75 + 75 - 15 - 15}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
