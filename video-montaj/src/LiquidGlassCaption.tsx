import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand, fontFamily } from "./brand";
import { captionLines, lawShieldInsert } from "./captions";

const msToFrames = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

export const LiquidGlassCaption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = (frame / fps) * 1000;

  if (nowMs >= lawShieldInsert.startMs && nowMs < lawShieldInsert.endMs) {
    return null;
  }

  const active = captionLines.find(
    (line) => nowMs >= line.startMs && nowMs < line.endMs,
  );

  if (!active) {
    return null;
  }

  const lineStartFrame = msToFrames(active.startMs, fps);
  const localFrame = frame - lineStartFrame;

  const enter = spring({
    frame: localFrame,
    fps,
    config: { damping: 18 },
    durationInFrames: 10,
  });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const blur = interpolate(enter, [0, 1], [8, 0]);
  const scale = interpolate(enter, [0, 1], [0.96, 1]);

  return (
    <AbsoluteFill
      style={{
        fontFamily,
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 230,
        paddingLeft: 56,
        paddingRight: 56,
      }}
    >
      <div
        style={{
          opacity,
          filter: `blur(${blur}px)`,
          transform: `scale(${scale})`,
          background: brand.glassBg,
          border: `1px solid ${brand.glassBorder}`,
          backdropFilter: "blur(22px)",
          borderRadius: 22,
          padding: "18px 26px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          textAlign: "center",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 33,
            fontWeight: 700,
            lineHeight: 1.35,
            textShadow: "0 2px 12px rgba(0,0,0,0.5)",
          }}
        >
          {active.text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
