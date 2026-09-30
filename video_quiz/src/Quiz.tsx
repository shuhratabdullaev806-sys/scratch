import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type {Option, QuizProps, ResolvedProps, ResolvedQuestion} from './types';

import {fontFamily} from './font';
import {OutroScene} from './Scenes';

const PILL_H = 130;
const PILL_GAP = 24;
const EXIT_FRAMES = 12;

const Background: React.FC<{video?: string | null; muteFrom: number}> = ({video, muteFrom}) => {
  const frame = useCurrentFrame();
  if (video) {
    return (
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile(video)}
          volume={(f) => (f >= muteFrom ? 0 : 1)}
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

const Header: React.FC<{title: string}> = ({title}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 15, stiffness: 100}});
  const shine = interpolate((frame % 150) / 150, [0, 1], [-30, 130]);
  return (
    <div
      style={{
        position: 'absolute',
        top: 90,
        left: 50,
        right: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        padding: '26px 34px',
        borderRadius: 36,
        overflow: 'hidden',
        background: `linear-gradient(100deg, #4361ee 0%, #3a0ca3 100%)`,
        border: '3px solid #ffffff44',
        boxShadow: '0 0 50px #4361ee77, 0 20px 50px rgba(0,0,0,0.45)',
        transform: `translateY(${interpolate(enter, [0, 1], [-240, 0])}px)`,
        opacity: enter,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(100deg, transparent ${shine - 12}%, rgba(255,255,255,0.22) ${shine}%, transparent ${shine + 12}%)`,
        }}
      />
      <Img src={staticFile('logo.svg')} style={{width: 88, height: 88, flexShrink: 0}} />
      <div
        style={{
          fontFamily,
          fontWeight: 800,
          fontSize: 54,
          lineHeight: 1.12,
          color: '#fff',
        }}
      >
        {title}
      </div>
    </div>
  );
};

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
        top: 330,
        left: 60,
        right: 60,
        transform: `translateY(${y}px)`,
        opacity: enter * (1 - exit),
      }}
    >
      <div style={{display: 'flex', gap: 16, marginBottom: 22}}>
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

  const lit = chosen && hit;
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
          background: lit
            ? `linear-gradient(90deg, ${option.color}, ${option.color}cc)`
            : 'rgba(10,16,38,0.82)',
          border: `3px solid ${lit ? '#ffffffaa' : option.color + '77'}`,
          boxShadow: lit
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
              background: lit ? '#fff' : option.color,
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
  const outroAt = Math.round(props.outroAt * fps);

  return (
    <AbsoluteFill style={{backgroundColor: '#05070f'}}>
      <Background video={props.video} muteFrom={outroAt} />
      <Shade />
      {props.title ? (
        <Sequence from={0} durationInFrames={Math.max(1, outroAt)} layout="none">
          <Header title={props.title} />
        </Sequence>
      ) : null}
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
      {props.outro ? (
        <Sequence from={outroAt} layout="none">
          <OutroScene outro={props.outro} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
