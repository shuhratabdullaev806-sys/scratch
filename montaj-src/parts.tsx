import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE_WINDOWS, C, FPS, MOOD, sec } from "./timeline";
import type { Answer } from "./timeline";

const FONT = "Montserrat, Arial Black, sans-serif";

/** 0 -> 1, overshoot bilan kiradi. */
export const popIn = (frame: number, startS: number, fps: number) =>
  spring({
    frame: frame - sec(startS),
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.6 },
  });

export const between = (t: number, a: number, b: number) => t >= a && t < b;

/* ---------------------------------------------------------------- tugmalar */

export const AnswerButton: React.FC<{
  kind: Answer;
  label: string;
  state: "idle" | "thinking" | "correct" | "wrong";
  progress: number; // 0..1, holatga kirish
}> = ({ kind, label, state, progress }) => {
  const frame = useCurrentFrame();
  const base = kind === "ROST" ? C.rost : C.yolgon;
  const dark = kind === "ROST" ? C.rostDark : C.yolgonDark;

  const breathe = 1 + Math.sin((frame / FPS) * Math.PI) * 0.015;
  const blink =
    state === "thinking"
      ? 0.9 + 0.1 * Math.sin((frame / FPS) * Math.PI * 2 + (kind === "ROST" ? 0 : Math.PI))
      : 1;

  let scale = breathe;
  let opacity = 1;
  let glow = 0;

  if (state === "correct") {
    scale = breathe * interpolate(progress, [0, 1], [1, 1.18], { extrapolateRight: "clamp" });
    glow = progress;
  } else if (state === "wrong") {
    scale = breathe * interpolate(progress, [0, 1], [1, 0.92], { extrapolateRight: "clamp" });
    opacity = interpolate(progress, [0, 1], [1, 0.4], { extrapolateRight: "clamp" });
  }

  return (
    <div
      style={{
        position: "relative",
        transform: `scale(${scale})`,
        opacity: opacity * blink,
        transition: "none",
      }}
    >
      <div
        style={{
          width: 396,
          padding: "24px 0",
          borderRadius: 32,
          background: `linear-gradient(180deg, ${base} 0%, ${dark} 100%)`,
          boxShadow: `0 10px 0 ${dark}, 0 16px 34px rgba(0,0,0,.45)${
            glow > 0 ? `, 0 0 ${40 * glow}px ${14 * glow}px ${base}` : ""
          }`,
          border: "5px solid rgba(255,255,255,.28)",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 54,
          letterSpacing: 0,
          whiteSpace: "nowrap",
          color: "#fff",
          textShadow: "0 4px 0 rgba(0,0,0,.35)",
        }}
      >
        {label}
      </div>

      {state === "correct" && progress > 0.15 ? (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: -64,
            width: 100,
            height: 100,
            borderRadius: 50,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 62,
            color: base,
            fontWeight: 900,
            boxShadow: "0 8px 22px rgba(0,0,0,.4)",
            transform: `scale(${interpolate(progress, [0.15, 0.6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })})`,
          }}
        >
          ✓
        </div>
      ) : null}
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
  const left = Math.max(0, Math.ceil(total - elapsed));
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
        <circle
          cx={100}
          cy={100}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,.18)"
          strokeWidth={12}
        />
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

export const QuestionText: React.FC<{
  lines: string[];
  from: number;
  to: number;
}> = ({ lines, from, to }) => {
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
        top: 148,
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
              fontSize: 54,
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

export const Progress: React.FC<{ current: number }> = ({ current }) => (
  <div
    style={{
      position: "absolute",
      top: 70,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      gap: 14,
    }}
  >
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        style={{
          width: i === current ? 84 : 26,
          height: 26,
          borderRadius: 13,
          background: i === current ? C.accent : "rgba(255,255,255,.4)",
          boxShadow: "0 4px 12px rgba(0,0,0,.4)",
        }}
      />
    ))}
  </div>
);

/* ------------------------------------------------------------ izoh karta */

export const ExplainCard: React.FC<{ text: string; from: number; to: number }> = ({
  text,
  from,
  to,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  if (!between(t, from, to)) return null;

  const s = popIn(frame, from, fps);
  const out = interpolate(t, [to - 0.3, to], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 1230,
        transform: `translateY(${(1 - s) * 60}px)`,
        opacity: Math.min(1, s * 1.5) * out,
        background: C.paper,
        borderRadius: 26,
        padding: "26px 34px",
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 44,
        lineHeight: 1.22,
        color: C.ink,
        textAlign: "center",
        boxShadow: "0 16px 40px rgba(0,0,0,.45)",
        borderBottom: `10px solid ${C.accent}`,
      }}
    >
      {text}
    </div>
  );
};

/* ------------------------------------------------------------ hisob karta */

export const CalcCard: React.FC<{
  lines: string[];
  from: number;
  to: number;
}> = ({ lines, from, to }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  if (!between(t, from, to)) return null;

  const out = interpolate(t, [to - 0.3, to], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 190,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        alignItems: "center",
        opacity: out,
      }}
    >
      {lines.map((line, i) => {
        const s = popIn(frame, from + 0.35 + i * 0.85, fps);
        const last = i === lines.length - 1;
        return (
          <div
            key={i}
            style={{
              transform: `translateY(${(1 - s) * 40}px) scale(${0.9 + s * 0.1})`,
              opacity: Math.min(1, s * 1.6),
              background: last ? C.accent : "rgba(8,10,16,.93)",
              color: last ? C.ink : "#fff",
              borderRadius: 16,
              padding: "16px 26px",
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 42,
              boxShadow: "0 10px 26px rgba(0,0,0,.4)",
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------- fon rangi */

/** Ko'klik darajasi 0..1. Savolda 0 (sariq), javobda 1 (ko'k). */
export const blueAmount = (t: number) => {
  const FADE = 0.45;
  let v = 0;
  for (const [a, b] of BLUE_WINDOWS) {
    const rise = interpolate(t, [a - FADE, a], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const fall = interpolate(t, [b, b + FADE], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    v = Math.max(v, Math.min(rise, fall));
  }
  return v;
};

/** Sekin suzuvchi yumshoq dog'lar — kadr jonlanib tursin. */
const BLOBS = [
  { x: 8, y: 14, r: 420, sx: 46, sy: 30, sp: 0.055, ph: 0 },
  { x: 88, y: 26, r: 360, sx: -38, sy: 44, sp: 0.041, ph: 1.7 },
  { x: 16, y: 74, r: 480, sx: 52, sy: -36, sp: 0.033, ph: 3.1 },
  { x: 92, y: 82, r: 400, sx: -44, sy: -28, sp: 0.047, ph: 4.4 },
];

const MoodLayer: React.FC<{ a: string; b: string; opacity: number; t: number }> = ({
  a,
  b,
  opacity,
  t,
}) => (
  <div style={{ position: "absolute", inset: 0, opacity }}>
    {/* chetlardan rang, markaz toza — yuz tabiiy qolsin */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(80% 56% at 50% 46%, ${b}00 0%, ${b}00 46%, ${b}CC 100%)`,
      }}
    />
    {/* suzuvchi dog'lar */}
    {BLOBS.map((o, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${o.x}%`,
          top: `${o.y}%`,
          width: o.r,
          height: o.r,
          marginLeft: -o.r / 2,
          marginTop: -o.r / 2,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${a}77 0%, ${a}00 70%)`,
          transform: `translate(${Math.sin(t * o.sp * Math.PI * 2 + o.ph) * o.sx}px, ${
            Math.cos(t * o.sp * Math.PI * 2 + o.ph) * o.sy
          }px)`,
        }}
      />
    ))}
    {/* yuqori va past chekka — matn uchun kontrast */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(180deg, ${b}99 0%, ${b}00 22%, ${b}00 74%, ${b}AA 100%)`,
      }}
    />
  </div>
);

export const MoodBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const blue = blueAmount(t);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <MoodLayer a={MOOD.warmA} b={MOOD.warmB} opacity={1 - blue} t={t} />
      <MoodLayer a={MOOD.coolA} b={MOOD.coolB} opacity={blue} t={t} />
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------- konfetti */

const CONFETTI = Array.from({ length: 46 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return {
    dx: (r(1) - 0.5) * 900,
    dy: -260 - r(2) * 560,
    rot: (r(3) - 0.5) * 900,
    size: 16 + r(4) * 22,
    color: ["#FFD23F", "#2ECC71", "#4DA3FF", "#FF7AB6", "#FFFFFF"][Math.floor(r(5) * 5)],
    delay: r(6) * 0.12,
  };
});

export const Confetti: React.FC<{ at: number; y: number }> = ({ at, y }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const life = 1.5;
  if (!between(t, at, at + life)) return null;

  return (
    <div style={{ position: "absolute", left: 254, top: y, width: 0, height: 0 }}>
      {CONFETTI.map((c, i) => {
        const p = Math.max(0, Math.min(1, (t - at - c.delay) / life));
        const x = c.dx * p;
        const y = c.dy * p + 900 * p * p;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: c.size,
              height: c.size * 0.55,
              background: c.color,
              borderRadius: 3,
              opacity: 1 - p * p,
              transform: `translate(${x}px, ${y}px) rotate(${c.rot * p}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};
