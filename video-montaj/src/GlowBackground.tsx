import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { brand } from "./brand";

export const GlowBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const drift1X = interpolate(frame, [0, 200], [0, 60], {
    extrapolateRight: "extend",
  });
  const drift2Y = interpolate(frame, [0, 240], [0, -50], {
    extrapolateRight: "extend",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: brand.navy, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          left: -300 + drift1X,
          top: -200,
          background: `radial-gradient(circle, ${brand.primary}55 0%, transparent 70%)`,
          filter: "blur(10px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          right: -250,
          bottom: -250 + drift2Y,
          background: `radial-gradient(circle, ${brand.secondary}4d 0%, transparent 70%)`,
          filter: "blur(10px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          left: "50%",
          top: "45%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${brand.accent}33 0%, transparent 75%)`,
          filter: "blur(20px)",
        }}
      />
    </AbsoluteFill>
  );
};
