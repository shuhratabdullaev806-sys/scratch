import React from 'react';
import {Composition, staticFile} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {Quiz} from './Quiz';
import type {QuizProps, ResolvedProps, ResolvedQuestion} from './types';
import data from './quiz.json';

export const FPS = 30;

const HOLD_AFTER_ANSWER = 2.5; // javob yonib turadigan vaqt
const GAP = 0.4; // savollar orasidagi bo'shliq
const ANSWER_DELAY = 1.0; // audio tugagach javobgacha pauza
const OUTRO_SECONDS = 5; // yakuniy ekran

/** Audio davomiyligini o'qiydi. Fayl yo'q bo'lsa, audio olib tashlanadi. */
const probe = async (audio: string | undefined, fallback: number) => {
  if (!audio) return {audio: undefined, seconds: fallback};
  try {
    return {audio, seconds: await getAudioDurationInSeconds(staticFile(audio))};
  } catch {
    return {audio: undefined, seconds: fallback};
  }
};

const resolve = async (props: QuizProps): Promise<ResolvedProps> => {
  let cursor = 0.5;
  let intro = props.intro;
  if (intro) {
    const a = await probe(intro.audio, intro.audioSeconds ?? 9);
    intro = {...intro, audio: a.audio, audioSeconds: a.seconds};
    cursor = a.seconds + (intro.holdSeconds ?? 3.5);
  }
  const introEnd = intro ? cursor : 0;

  const questions: ResolvedQuestion[] = [];
  for (const q of props.questions) {
    const a = await probe(q.audio, q.audioSeconds ?? 3.5);
    const at = q.at ?? cursor;
    const answerAt = q.answerAt ?? at + a.seconds + ANSWER_DELAY;
    const endAt = answerAt + HOLD_AFTER_ANSWER;
    questions.push({...q, audio: a.audio, at, answerAt, endAt, audioSeconds: a.seconds});
    cursor = endAt + GAP;
  }

  const outroAt = cursor;
  const outroEnd = outroAt + (props.outro ? props.outro.seconds ?? OUTRO_SECONDS : 1);
  return {...props, intro, questions, introEnd, outroAt, outroEnd};
};

export const Root: React.FC = () => (
  <Composition
    id="Quiz"
    component={Quiz}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={300}
    defaultProps={data as unknown as QuizProps}
    calculateMetadata={async ({props}) => {
      const resolved = await resolve(props as QuizProps);
      return {
        props: resolved as unknown as QuizProps,
        durationInFrames: Math.max(1, Math.ceil(resolved.outroEnd * FPS)),
      };
    }}
  />
);
