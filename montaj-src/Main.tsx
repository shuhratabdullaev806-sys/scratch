import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  AnswerButton,
  BigNumber,
  CalcCard,
  Confetti,
  Countdown,
  ExplainCard,
  MoodBackground,
  Progress,
  QuestionText,
  between,
  popIn,
} from "./parts";
import { C, FPS, INTRO, OUTRO, QUESTIONS } from "./timeline";

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
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 150,
        opacity: out,
      }}
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
          fontSize: 78,
          textAlign: "center",
          lineHeight: 1.1,
          boxShadow: "0 16px 40px rgba(0,0,0,.5)",
        }}
      >
        FOIZSIZ QARZ
        <br />= SOLIQ?
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
          fontSize: 44,
        }}
      >
        SK 299-modda — 3 savol
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  if (t < OUTRO.from) return null;

  const s = popIn(frame, OUTRO.from + 0.1, fps);
  const pulse = 1 + 0.05 * Math.sin((t - OUTRO.from) * Math.PI * 3);

  return (
    <AbsoluteFill>
      {/* sarlavha — bosh ustidagi bo'sh joyda */}
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
          Nechta to'g'ri
          <br />
          topdingiz?
        </div>
      </div>

      {/* CTA — pastdagi bo'sh joyda */}
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
          Izohda yozing
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
          🔔 Obuna bo'ling
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // Qaysi savol faol?
  const active = QUESTIONS.find((q) => t >= q.labelAt - 0.6 && t < (QUESTIONS[q.n] ? QUESTIONS[q.n].labelAt - 0.6 : OUTRO.from));
  const revealed = QUESTIONS.filter((q) => t >= q.pauseTo);
  const last = revealed[revealed.length - 1];

  // Tugmalar holati
  let rostState: "idle" | "thinking" | "correct" | "wrong" = "idle";
  let yolgonState: "idle" | "thinking" | "correct" | "wrong" = "idle";
  let progress = 0;

  const thinking = QUESTIONS.find((q) => between(t, q.pauseFrom, q.pauseTo));
  if (thinking) {
    rostState = "thinking";
    yolgonState = "thinking";
  } else if (last && active && last.n === active.n) {
    progress = Math.min(1, (t - last.pauseTo) / 0.35);
    if (last.answer === "ROST") {
      rostState = "correct";
      yolgonState = "wrong";
    } else {
      yolgonState = "correct";
      rostState = "wrong";
    }
  }

  const quizOn = t >= INTRO.to && t < OUTRO.from;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* manba video */}
      <OffthreadVideo
        src={staticFile("source.mp4")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(1.06) saturate(1.06) contrast(1.03)",
        }}
      />
      {/* rang kayfiyati: savolda sariq, javobda ko'k */}
      <MoodBackground />

      <Intro />

      {quizOn ? <Progress current={active ? active.n : 3} /> : null}

      {QUESTIONS.map((q) => (
        <React.Fragment key={q.n}>
          <BigNumber n={q.n} at={q.labelAt} />
          <QuestionText lines={q.screenText} from={q.textFrom} to={q.pauseTo + 0.9} />
          <Countdown from={q.pauseFrom} to={q.pauseTo} />
          <ExplainCard text={q.explain} from={q.explainFrom} to={q.explainTo + 0.4} />
          {q.calc ? (
            <CalcCard lines={q.calc.lines} from={q.calc.from} to={q.calc.to} />
          ) : null}
        </React.Fragment>
      ))}

      {/* doimiy tugmalar */}
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
          <AnswerButton
            kind="YOLGON"
            label="YOLG'ON"
            state={yolgonState}
            progress={progress}
          />
        </div>
      ) : null}

      {/* konfetti tugmalar ustida */}
      {QUESTIONS.map((q) => (
        <Confetti key={q.n} at={q.pauseTo} y={q.answer === "ROST" ? 968 : 1130} />
      ))}

      <Outro />
    </AbsoluteFill>
  );
};
