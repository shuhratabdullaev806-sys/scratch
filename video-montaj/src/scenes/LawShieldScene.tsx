import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand, fontFamily } from "../brand";
import { GlowBackground } from "../GlowBackground";

const DocumentIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 240" fill="none">
    <defs>
      <linearGradient id="docGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={brand.primary} />
        <stop offset="100%" stopColor={brand.secondary} />
      </linearGradient>
    </defs>
    <rect
      x="10"
      y="10"
      width="180"
      height="220"
      rx="18"
      fill="rgba(255,255,255,0.06)"
      stroke="url(#docGrad)"
      strokeWidth="4"
    />
    {[60, 92, 124, 156].map((y, i) => (
      <rect
        key={y}
        x="34"
        y={y}
        width={i === 3 ? 70 : 132}
        height="10"
        rx="5"
        fill="rgba(226,232,240,0.65)"
      />
    ))}
  </svg>
);

const ProhibitIcon: React.FC<{ progress: number; size: number }> = ({
  progress,
  size,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: `translate(-50%, -50%) scale(${progress}) rotate(${interpolate(
        progress,
        [0, 1],
        [-25, 0],
      )}deg)`,
      filter: `drop-shadow(0 0 24px ${brand.accent}aa)`,
    }}
  >
    <circle
      cx="100"
      cy="100"
      r="88"
      fill="none"
      stroke={brand.accent}
      strokeWidth="16"
    />
    <line
      x1="42"
      y1="42"
      x2="158"
      y2="158"
      stroke={brand.accent}
      strokeWidth="16"
      strokeLinecap="round"
    />
  </svg>
);

export const LawShieldScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeIn = spring({ frame, fps, config: { damping: 16 }, durationInFrames: 18 });
  const docIn = spring({
    frame: frame - 8,
    fps,
    config: { damping: 14 },
    durationInFrames: 20,
  });
  const prohibitIn = spring({
    frame: frame - 26,
    fps,
    config: { damping: 10, mass: 0.6 },
    durationInFrames: 18,
  });
  const titleIn = spring({
    frame: frame - 40,
    fps,
    config: { damping: 16 },
    durationInFrames: 18,
  });
  const stampIn = spring({
    frame: frame - 55,
    fps,
    config: { damping: 9, mass: 0.7 },
    durationInFrames: 16,
  });

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <GlowBackground />

      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 170 }}
      >
        <div
          style={{
            opacity: badgeIn,
            transform: `translateY(${interpolate(badgeIn, [0, 1], [-20, 0])}px)`,
            background: brand.gradient,
            padding: "12px 32px",
            borderRadius: 999,
            fontSize: 30,
            fontWeight: 700,
            color: "white",
            letterSpacing: 1,
          }}
        >
          Soliq Kodeksi — 138-modda
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            width: 280,
            height: 280,
            opacity: docIn,
            transform: `scale(${interpolate(docIn, [0, 1], [0.7, 1])})`,
          }}
        >
          <DocumentIcon size={280} />
          <ProhibitIcon progress={prohibitIn} size={320} />
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 260,
        }}
      >
        <div
          style={{
            opacity: titleIn,
            transform: `translateY(${interpolate(titleIn, [0, 1], [30, 0])}px)`,
            textAlign: "center",
            color: brand.textMain,
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 1.15,
            padding: "0 60px",
          }}
        >
          Boshlang'ich hujjatlar
          <br />
          TALAB QILINMAYDI
        </div>

        <div
          style={{
            marginTop: 36,
            opacity: stampIn,
            transform: `scale(${interpolate(stampIn, [0, 1], [1.6, 1])}) rotate(-7deg)`,
            border: `4px solid ${brand.accent}`,
            color: brand.accent,
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: 3,
            padding: "10px 28px",
            borderRadius: 12,
            textTransform: "uppercase",
          }}
        >
          Taqiqlangan
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
