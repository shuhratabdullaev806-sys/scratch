export type Option = {id: string; label: string; color: string};

export type Question = {
  text: string;
  topic?: string;
  answer: string;
  /** public/ ichidagi savol audiosi, masalan "audio/q01.mp3" */
  audio?: string;
  /** audio bo'lmaganda savol davomiyligi (soniya) */
  audioSeconds?: number;
  /** savol chiqadigan vaqt (soniya). Bo'lmasa oldingisidan keyin ketma-ket */
  at?: number;
  /** javob yonadigan vaqt (soniya). Bo'lmasa savol audiosi tugagach */
  answerAt?: number;
};

export type QuizProps = {
  /** public/ ichidagi javob videosi, masalan "video/javoblar.mp4" */
  video?: string;
  /** jami davomiylik (soniya). Bo'lmasa oxirgi savoldan keyin avtomatik */
  totalSeconds?: number;
  options: Option[];
  questions: Question[];
};

export type ResolvedQuestion = Question & {
  at: number;
  answerAt: number;
  endAt: number;
  audioSeconds: number;
};

export type ResolvedProps = Omit<QuizProps, 'questions'> & {
  questions: ResolvedQuestion[];
};
