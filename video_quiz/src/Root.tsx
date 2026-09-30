import React from 'react';
import {Composition, staticFile} from 'remotion';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {Quiz} from './Quiz';
import type {QuizProps, ResolvedProps, ResolvedQuestion} from './types';
import data from './quiz.json';

export const FPS = 30;

const FIRST_AT = 0.15; // birinchi savol chiqadigan vaqt
const GAP = 0.2; // savol audiosi tugagach javobgacha pauza
const HOLD_AFTER_ANSWER = 2.5; // video bo'lmaganda javob yonib turadigan vaqt
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
  const audios = await Promise.all(
    props.questions.map((q) => probe(q.audio, q.audioSeconds ?? 3.5)),
  );
  const synced = Boolean(props.video) && Boolean(props.videoSeconds) && props.questions.every((q) => q.videoAnswerAt !== undefined);

  const questions: ResolvedQuestion[] = [];
  let videoStart = 0;
  let videoEnd = 0;

  if (synced) {
    // Video uzluksiz o'ynaydi; savollar videodagi pauzalarga joylanadi,
    // javob esa video ichida aytilgan paytda yonadi.
    const first = props.questions[0].videoAnswerAt as number;
    videoStart = Math.max(0, FIRST_AT + audios[0].seconds + GAP - first);
    videoEnd = videoStart + (props.videoSeconds ?? 0);
    props.questions.forEach((q, i) => {
      const answerAt = videoStart + (q.videoAnswerAt as number);
      const at = answerAt - audios[i].seconds - GAP;
      questions.push({...q, audio: audios[i].audio, audioSeconds: audios[i].seconds, at, answerAt, endAt: 0});
    });
    questions.forEach((q, i) => {
      q.endAt = i + 1 < questions.length ? questions[i + 1].at : videoEnd;
    });
  } else {
    let cursor = 1.0;
    props.questions.forEach((q, i) => {
      const at = q.at ?? cursor;
      const answerAt = q.answerAt ?? at + audios[i].seconds + 1.0;
      const endAt = answerAt + HOLD_AFTER_ANSWER;
      questions.push({...q, audio: audios[i].audio, audioSeconds: audios[i].seconds, at, answerAt, endAt});
      cursor = endAt + 0.4;
    });
    videoEnd = cursor;
  }

  const outroAt = videoEnd;
  const outroEnd = outroAt + (props.outro ? props.outro.seconds ?? OUTRO_SECONDS : 1);
  return {...props, questions, videoStart, outroAt, outroEnd};
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
