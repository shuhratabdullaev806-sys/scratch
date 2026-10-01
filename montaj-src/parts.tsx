import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FPS, sec } from "./timeline";

const FONT = "Montserrat, Arial Black, sans-serif";

/** 0 -> 1, overshoot bilan kiradi. */
export const popIn = (frame: number, startS: number, fps: number) =>
  spring({
    frame: frame - sec(startS),
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.6 },
  });

export const between = (t: number, a: number, b: number) => t >= a && t < b;

/* ---------------------------------------------------------------- tugmalar
 * Javoblar videoda ochilmaydi, shuning uchun tugmalar hech qachon yonmaydi.
 * Ular savolning bir qismi: "ROSTmi yoki YOLG'ONmi?" degan taklif.
 * Pauza paytida ikkalasi navbatma-navbat sekin yonib-o'chadi — tanlash
 * kerakligini eslatadi, lekin javobni bermaydi.
 */

export const AnswerButton: React.FC<{
  kind: "ROST" | "YOLGON";
  label: string;
  thinking: boolean;
}> = ({ kind, label, thinking }) => {
  const frame = useCurrentFrame();
  const base = kind === "ROST" ? C.rost : C.yolgon;
  const dark = kind === "ROST" ? C.rostDark : C.yolgonDark;

  const breathe = 1 + Math.sin((frame / FPS) * Math.PI) * 0.015;
  const blink = thinking
    ? 0.9 + 0.1 * Math.sin((frame / FPS) * Math.PI * 2 + (kind === "ROST" ? 0 : Math.PI))
    : 1;

  return (
    <div style={{ transform: `scale(${breathe})`, opacity: blink }}>
      <div
        style={{
          width: 396,
          padding: "24px 0",
          borderRadius: 32,
          background: `linear-gradient(180deg, ${base} 0%, ${dark} 100%)`,
          boxShadow: `0 10px 0 ${dark}, 0 16px 34px rgba(0,0,0,.45)`,
          border: "5px solid rgba(255,255,255,.28)",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 54,
          whiteSpace: "nowrap",
          color: "#fff",
          textShadow: "0 4px 0 rgba(0,0,0,.35)",
        }}
      >
        {label}
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------- taymer */

export const Countdown: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (!between(t, from, to)) return null;

  const total = to - from;
  const elapsed = t - from;
  const left = Math.max(1, Math.ceil(total - elapsed));
  const ratio = Math.min(1, elapsed / total);

  const R = 86;
  const CIRC = 2 * Math.PI * R;
  const inScale = interpolate(elapsed, [0, 0.3], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tick = 1 + 0.12 * (1 - Math.min(1, (elapsed % 1) / 0.25));

  return (
    <div
      style={{
        position: "absolute",
        right: 70,
        top: 720,
        width: 200,
        height: 200,
        transform: `scale(${inScale * tick})`,
      }}
    >
      <svg width={200} height={200} style={{ position: "absolute", inset: 0 }}>
        <circle cx={100} cy={100} r={R} fill="rgba(8,10,16,.88)" />
        <circle cx={100} cy={100} r={R} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={12} />
        <circle
          cx={100}
          cy={100}
          r={R}
          fill="none"
          stroke={C.accent}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * ratio}
          transform="rotate(-90 100 100)"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 92,
          color: "#fff",
        }}
      >
        {left}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------- savol matni */

export const QuestionText: React.FC<{ lines: string[]; from: number; to: number }> = ({
  lines,
  from,
  to,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  if (!between(t, from, to)) return null;

  const out = interpolate(t, [to - 0.25, to], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 104,
        left: 0,
        right: 0,
        padding: "0 50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity: out,
      }}
    >
      {lines.map((line, i) => {
        const s = popIn(frame, from + i * 0.18, fps);
        return (
          <div
            key={i}
            style={{
              transform: `translateY(${(1 - s) * 40}px) scale(${0.85 + s * 0.15})`,
              opacity: Math.min(1, s * 1.4),
              background: "rgba(8,10,16,.93)",
              borderRadius: 18,
              padding: "12px 26px",
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 50,
              lineHeight: 1.12,
              color: "#fff",
              textAlign: "center",
              boxShadow: "0 10px 26px rgba(0,0,0,.35)",
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------ savol raqami */

export const BigNumber: React.FC<{ n: number; at: number }> = ({ n, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  const show = 1.1;
  if (!between(t, at, at + show)) return null;

  const s = popIn(frame, at, fps);
  const leave = interpolate(t, [at + show - 0.35, at + show], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: leave,
      }}
    >
      <div
        style={{
          transform: `scale(${(0.4 + s * 0.6) * (0.4 + leave * 0.6)})`,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 460,
          color: C.accent,
          textShadow: "0 14px 0 rgba(0,0,0,.45), 0 0 90px rgba(255,210,63,.55)",
          WebkitTextStroke: "10px rgba(10,12,18,.85)",
        }}
      >
        {n}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------- indikator */

export const Progress: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div
    style={{
      position: "absolute",
      top: 40,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      gap: 12,
    }}
  >
    {Array.from({ length: total }, (_, i) => i + 1).map((i) => (
      <div
        key={i}
        style={{
          width: i === current ? 72 : 22,
          height: 22,
          borderRadius: 11,
          background: i === current ? C.accent : "rgba(255,255,255,.45)",
          boxShadow: "0 4px 12px rgba(0,0,0,.45)",
        }}
      />
    ))}
  </div>
);
