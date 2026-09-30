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
const TAIL = 2.0; // oxirgi savoldan keyin

const resolve = async (props: QuizProps): Promise<ResolvedProps> => {
  const questions: ResolvedQuestion[] = [];
  let cursor = 1.0;
  for (const q of props.questions) {
    let audioSeconds = q.audioSeconds ?? 3.5;
    if (q.audio) {
      try {
        audioSeconds = await getAudioDurationInSeconds(staticFile(q.audio));
      } catch {
        // fayl hali yuklanmagan bo'lsa, taxminiy davomiylik qoladi
      }
    }
    const at = q.at ?? cursor;
    const answerAt = q.answerAt ?? at + audioSeconds + ANSWER_DELAY;
    const endAt = answerAt + HOLD_AFTER_ANSWER;
    questions.push({...q, at, answerAt, endAt, audioSeconds});
    cursor = endAt + GAP;
  }
  return {...props, questions};
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
      const lastEnd = resolved.questions[resolved.questions.length - 1]?.endAt ?? 0;
      const total = props.totalSeconds ?? lastEnd + TAIL;
      return {
        props: resolved as unknown as QuizProps,
        durationInFrames: Math.max(1, Math.ceil(total * FPS)),
      };
    }}
  />
);
