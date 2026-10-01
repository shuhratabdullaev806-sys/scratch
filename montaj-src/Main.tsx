import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  AnswerButton,
  Confetti,
  Countdown,
  Progress,
  QuestionText,
  between,
  popIn,
} from "./parts";
import { EndCard } from "./EndCard";
import {
  C,
  ENDCARD_S,
  FPS,
  INTRO,
  OUTRO,
  QUESTIONS,
  REVEAL_S,
  SOURCE_S,
  TITLES,
  sec,
} from "./timeline";

const FONT = "Montserrat, Arial Black, sans-serif";

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  if (!between(t, INTRO.from, INTRO.to + 0.4)) return null;

  const s = popIn(frame, 0.15, fps);
  const out = interpolate(t, [INTRO.to, INTRO.to + 0.4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 150, opacity: out }}
    >
      <div
        style={{
          transform: `translateY(${(1 - s) * 70}px) scale(${0.8 + s * 0.2})`,
          background: C.accent,
          color: C.ink,
          borderRadius: 26,
          padding: "22px 40px",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 76,
          textAlign: "center",
          lineHeight: 1.08,
          boxShadow: "0 16px 40px rgba(0,0,0,.5)",
        }}
      >
        {TITLES.introBig[0]}
        <br />
        {TITLES.introBig[1]}
      </div>
      <div
        style={{
          marginTop: 22,
          transform: `scale(${0.8 + popIn(frame, 0.5, fps) * 0.2})`,
          background: "rgba(8,10,16,.93)",
          color: "#fff",
          borderRadius: 18,
          padding: "14px 30px",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 42,
        }}
      >
        {TITLES.introSmall}
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  if (t < OUTRO.from || t >= SOURCE_S) return null;

  const s = popIn(frame, OUTRO.from + 0.1, fps);
  const pulse = 1 + 0.05 * Math.sin((t - OUTRO.from) * Math.PI * 3);
  const out = interpolate(t, [SOURCE_S - 0.35, SOURCE_S], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `translateY(${(1 - s) * 60}px) scale(${0.85 + s * 0.15})`,
            background: "rgba(8,10,16,.93)",
            color: "#fff",
            borderRadius: 24,
            padding: "22px 36px",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 58,
            textAlign: "center",
            lineHeight: 1.14,
            boxShadow: "0 16px 40px rgba(0,0,0,.5)",
          }}
        >
          {TITLES.outroBig[0]}
          <br />
          {TITLES.outroBig[1]}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 190,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            background: C.accent,
            color: C.ink,
            borderRadius: 18,
            padding: "16px 34px",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 48,
            transform: `scale(${(0.85 + popIn(frame, OUTRO.from + 0.45, fps) * 0.15) * pulse})`,
            boxShadow: "0 10px 28px rgba(0,0,0,.45)",
          }}
        >
          {TITLES.outroCta}
        </div>
        <div
          style={{
            background: C.yolgon,
            color: "#fff",
            borderRadius: 18,
            padding: "16px 34px",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 46,
            transform: `scale(${(0.85 + popIn(frame, OUTRO.from + 0.8, fps) * 0.15) * pulse})`,
            boxShadow: "0 10px 28px rgba(0,0,0,.45)",
          }}
        >
          {TITLES.outroSub}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const active = QUESTIONS.find(
    (q, i) => t >= q.labelAt - 0.6 && (i + 1 >= QUESTIONS.length || t < QUESTIONS[i + 1].labelAt - 0.6)
  );
  const thinking = QUESTIONS.some((q) => between(t, q.pauseFrom, q.pauseTo));

  // Pauza tugagach to'g'ri tugma qisqa vaqt yonadi.
  const revealing = QUESTIONS.find((q) => between(t, q.pauseTo, q.pauseTo + REVEAL_S));
  const progress = revealing ? Math.min(1, (t - revealing.pauseTo) / 0.3) : 0;

  let rostState: "idle" | "thinking" | "correct" | "wrong" = "idle";
  let yolgonState: "idle" | "thinking" | "correct" | "wrong" = "idle";
  if (revealing) {
    rostState = revealing.answer === "ROST" ? "correct" : "wrong";
    yolgonState = revealing.answer === "ROST" ? "wrong" : "correct";
  } else if (thinking) {
    rostState = "thinking";
    yolgonState = "thinking";
  }

  const lastQ = QUESTIONS[QUESTIONS.length - 1];
  const quizOn = t >= INTRO.to && t < lastQ.pauseTo + REVEAL_S;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* manba video — fonga tegilmaydi, hech qanday filtr qo'yilmaydi */}
      <Sequence durationInFrames={sec(SOURCE_S)}>
        <OffthreadVideo
          src={staticFile("source.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>

      <Intro />

      {quizOn ? <Progress current={active ? active.n : QUESTIONS.length} total={QUESTIONS.length} /> : null}

      {QUESTIONS.map((q) => (
        <React.Fragment key={q.n}>
          <QuestionText lines={q.screenText} from={q.textFrom} to={q.pauseTo + REVEAL_S} />
          <Countdown from={q.pauseFrom} to={q.pauseTo} />
        </React.Fragment>
      ))}

      {/* tugmalar — butun viktorina davomida bir xil, javob bermaydi */}
      {quizOn ? (
        <div
          style={{
            position: "absolute",
            left: 56,
            top: 900,
            display: "flex",
            flexDirection: "column",
            gap: 34,
          }}
        >
          <AnswerButton kind="ROST" label="ROST" state={rostState} progress={progress} />
          <AnswerButton kind="YOLGON" label="YOLG'ON" state={yolgonState} progress={progress} />
        </div>
      ) : null}

      {/* konfetti tugmalar ustida */}
      {QUESTIONS.map((q) => (
        <Confetti key={q.n} at={q.pauseTo} y={q.answer === "ROST" ? 968 : 1130} />
      ))}

      <Outro />

      {/* aloqa kartochkasi */}
      <Sequence from={sec(SOURCE_S)} durationInFrames={sec(ENDCARD_S)}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
