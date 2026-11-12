import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand, fontFamily } from "./brand";

const VISIBLE_DURATION_FRAMES = 300;
const EXIT_DURATION_FRAMES = 20;

export const NameCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 16 },
    durationInFrames: 18,
  });

  const exitStart = VISIBLE_DURATION_FRAMES - EXIT_DURATION_FRAMES;
  const exit = interpolate(frame, [exitStart, VISIBLE_DURATION_FRAMES], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = Math.min(entrance, exit);
  const slideX = interpolate(entrance, [0, 1], [-40, 0]);

  if (frame >= VISIBLE_DURATION_FRAMES) {
    return null;
  }

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <div
        style={{
          position: "absolute",
          left: 48,
          bottom: 90,
          opacity,
          transform: `translateX(${slideX}px)`,
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: brand.glassBg,
          border: `1px solid ${brand.glassBorder}`,
          backdropFilter: "blur(18px)",
          borderRadius: 20,
          padding: "14px 24px 14px 14px",
          boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            width: 4,
            alignSelf: "stretch",
            borderRadius: 4,
            background: brand.gradient,
          }}
        />
        <div>
          <div
            style={{
              color: brand.textMain,
              fontSize: 26,
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Shuxrat Abdullaev
          </div>
          <div
            style={{
              color: brand.textDim,
              fontSize: 18,
              fontWeight: 500,
              marginTop: 2,
            }}
          >
            Buxgalter
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
