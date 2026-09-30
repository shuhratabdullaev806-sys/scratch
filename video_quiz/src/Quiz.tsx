import React from 'react';
import {
  AbsoluteFill,
  Audio,
  cancelRender,
  continueRender,
  delayRender,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type {Option, QuizProps, ResolvedProps, ResolvedQuestion} from './types';

const fontFamily = 'Montserrat, sans-serif';

const loadFonts = () => {
  const handle = delayRender('Shriftlar yuklanmoqda');
  const files: [string, string, string][] = [
    ['600', 'latin', 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122'],
    ['600', 'latin-ext', 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF'],
    ['800', 'latin', 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122'],
    ['800', 'latin-ext', 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF'],
  ];
  Promise.all(
    files.map(async ([weight, subset, range]) => {
      const face = new FontFace(
        'Montserrat',
        `url(${staticFile(`fonts/montserrat-${subset}-${weight}-normal.woff2`)}) format('woff2')`,
        {weight, unicodeRange: range},
      );
      await face.load();
      (document.fonts as unknown as {add: (f: FontFace) => void}).add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => cancelRender(e));
};
loadFonts();

const PILL_H = 130;
const PILL_GAP = 24;
const EXIT_FRAMES = 12;

const Background: React.FC<{video?: string | null}> = ({video}) => {
  const frame = useCurrentFrame();
  if (video) {
    return (
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile(video)}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </AbsoluteFill>
    );
  }
  const shift = interpolate(frame % 600, [0, 300, 600], [0, 40, 0]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${30 + shift}% 35%, #1e3a8a 0%, #0b1020 55%, #05070f 100%)`,
      }}
    />
  );
};

const Shade: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'linear-gradient(180deg, rgba(3,6,18,0.78) 0%, rgba(3,6,18,0) 32%, rgba(3,6,18,0) 55%, rgba(3,6,18,0.82) 100%)',
    }}
  />
);

const QuestionCard: React.FC<{
  q: ResolvedQuestion;
  index: number;
  total: number;
  exit: number;
}> = ({q, index, total, exit}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 16, stiffness: 110}});
  const y = interpolate(enter, [0, 1], [-320, 0]) - exit * 60;
  const words = q.text.split(' ');

  return (
    <div
      style={{
        position: 'absolute',
        top: 120,
        left: 60,
        right: 60,
        transform: `translateY(${y}px)`,
        opacity: enter * (1 - exit),
      }}
    >
      <div style={{display: 'flex', gap: 16, marginBottom: 22}}>
        {q.topic ? (
          <div style={chip('#38bdf8')}>{q.topic}</div>
        ) : null}
        <div style={chip('#94a3b8')}>
          Savol {index + 1} / {total}
        </div>
      </div>
      <div
        style={{
          padding: '48px 52px',
          borderRadius: 44,
          background: 'rgba(10,16,38,0.78)',
          border: '2px solid rgba(148,163,184,0.28)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0 22px',
        }}
      >
        {words.map((w, i) => {
          const p = spring({
            frame: frame - 6 - i * 4,
            fps,
            config: {damping: 14, stiffness: 140},
          });
          return (
            <span
              key={i}
              style={{
                fontFamily,
                fontWeight: 800,
                fontSize: 78,
                lineHeight: 1.18,
                color: '#f8fafc',
                display: 'inline-block',
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [36, 0])}px)`,
                filter: `blur(${interpolate(p, [0, 1], [10, 0])}px)`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const chip = (color: string): React.CSSProperties => ({
  fontFamily,
  fontWeight: 600,
  fontSize: 30,
  color,
  padding: '10px 24px',
  borderRadius: 999,
  background: 'rgba(10,16,38,0.7)',
  border: `2px solid ${color}55`,
  letterSpacing: 1,
});

const Check: React.FC<{progress: number}> = ({progress}) => (
  <svg width="64" height="64" viewBox="0 0 64 64">
    <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.95)" />
    <path
      d="M18 33 L28 43 L47 22"
      fill="none"
      stroke="#0b1020"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={50}
      strokeDashoffset={50 * (1 - progress)}
    />
  </svg>
);

const OptionPill: React.FC<{
  option: Option;
  index: number;
  chosen: boolean;
  answerFrame: number;
  exit: number;
}> = ({option, index, chosen, answerFrame, exit}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - 18 - index * 6,
    fps,
    config: {damping: 13, stiffness: 120},
  });

  const hit = frame >= answerFrame;
  const a = hit
    ? spring({
        frame: frame - answerFrame,
        fps,
        config: {damping: 10, stiffness: 160},
      })
    : 0;

  const scale = chosen
    ? interpolate(enter, [0, 1], [0.8, 1]) * (1 + 0.07 * a)
    : interpolate(enter, [0, 1], [0.8, 1]) * (1 - 0.04 * a);
  const dim = hit && !chosen ? 1 - 0.65 * a : 1;
  const pulse = chosen && hit ? 0.55 + 0.45 * Math.sin((frame - answerFrame) / 4) : 0;
  const glow = chosen ? a * (40 + pulse * 40) : 0;

  const ringT = chosen && hit ? (frame - answerFrame) / 26 : 2;
  const ringVisible = ringT >= 0 && ringT <= 1;

  return (
    <div
      style={{
        position: 'relative',
        height: PILL_H,
        transform: `translateY(${interpolate(enter, [0, 1], [220, 0]) + exit * 80}px) scale(${scale})`,
        opacity: enter * dim * (1 - exit),
      }}
    >
      {ringVisible ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 40,
            border: `6px solid ${option.color}`,
            transform: `scale(${1 + ringT * 0.35})`,
            opacity: 1 - ringT,
          }}
        />
      ) : null}
      <div
        style={{
          height: '100%',
          borderRadius: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 48px',
          fontFamily,
          fontWeight: 800,
          fontSize: 56,
          color: '#f8fafc',
          background: chosen
            ? `linear-gradient(90deg, ${option.color}, ${option.color}cc)`
            : 'rgba(10,16,38,0.82)',
          border: `3px solid ${chosen ? '#ffffffaa' : option.color + '77'}`,
          boxShadow: chosen
            ? `0 0 ${glow}px ${option.color}, 0 20px 50px rgba(0,0,0,0.45)`
            : '0 16px 40px rgba(0,0,0,0.4)',
        }}
      >
        <span style={{display: 'flex', alignItems: 'center', gap: 28}}>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              background: chosen ? '#fff' : option.color,
            }}
          />
          {option.label}
        </span>
        {chosen && hit ? <Check progress={Math.min(1, a)} /> : null}
      </div>
    </div>
  );
};

const QuestionScene: React.FC<{
  q: ResolvedQuestion;
  index: number;
  total: number;
  options: Option[];
}> = ({q, index, total, options}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const answerFrame = Math.round((q.answerAt - q.at) * fps);
  const exit = interpolate(
    frame,
    [durationInFrames - EXIT_FRAMES, durationInFrames],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)},
  );

  return (
    <AbsoluteFill>
      <QuestionCard q={q} index={index} total={total} exit={exit} />
      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          bottom: 130,
          display: 'flex',
          flexDirection: 'column',
          gap: PILL_GAP,
        }}
      >
        {options.map((o, i) => (
          <OptionPill
            key={o.id}
            option={o}
            index={i}
            chosen={o.id === q.answer}
            answerFrame={answerFrame}
            exit={exit}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const Quiz: React.FC<QuizProps> = (rawProps) => {
  const props = rawProps as ResolvedProps;
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: '#05070f'}}>
      <Background video={props.video} />
      <Shade />
      {props.questions.map((q, i) => {
        const from = Math.round(q.at * fps);
        const duration = Math.max(1, Math.round((q.endAt - q.at) * fps));
        return (
          <React.Fragment key={i}>
            {q.audio ? (
              <Sequence from={from} layout="none">
                <Audio src={staticFile(q.audio)} />
              </Sequence>
            ) : null}
            <Sequence from={from} durationInFrames={duration} layout="none">
              <QuestionScene
                q={q}
                index={i}
                total={props.questions.length}
                options={props.options}
              />
            </Sequence>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
