// Barcha vaqtlar soniyada, manba videodan silencedetect orqali olingan.
export const FPS = 30;
export const DURATION_S = 71.02;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export type Answer = "ROST" | "YOLGON";

export type Question = {
  n: number;
  answer: Answer;
  labelAt: number; // "Birinchi savol." aytilgan payt
  textFrom: number; // savol matni ekranga chiqadi
  pauseFrom: number; // jimlik boshlanishi -> taymer
  pauseTo: number; // jimlik tugashi -> javob ochiladi
  screenText: string[]; // ekrandagi qatorlar
  explainFrom: number;
  explainTo: number;
  explain: string;
  calc?: { lines: string[]; from: number; to: number };
};

export const INTRO = { from: 0, to: 3.46 };

export const QUESTIONS: Question[] = [
  {
    n: 1,
    answer: "YOLGON",
    labelAt: 4.69,
    textFrom: 5.95,
    pauseFrom: 11.73,
    pauseTo: 14.96,
    screenText: ["Foizsiz qarz —", "qaytariladigan pul.", "Soliq chiqmaydi."],
    explainFrom: 17.0,
    explainTo: 21.78,
    explain: "Buxgalteriyada daromad yo'q — soliq hisobida bor",
  },
  {
    n: 2,
    answer: "ROST",
    labelAt: 23.03,
    textFrom: 24.21,
    pauseFrom: 32.81,
    pauseTo: 36.0,
    screenText: ["100 mln foizsiz qarz.", "MB stavkasi 14%.", "Daromadga 14 mln."],
    explainFrom: 38.1,
    explainTo: 41.94,
    explain: "15% foyda solig'i — 2 100 000 so'm",
    calc: {
      lines: ["100 mln × 14% = 14 mln", "14 mln × 15% = 2,1 mln"],
      from: 38.1,
      to: 42.6,
    },
  },
  {
    n: 3,
    answer: "YOLGON",
    labelAt: 43.06,
    textFrom: 44.3,
    pauseFrom: 53.06,
    pauseTo: 56.53,
    screenText: ["2026-yildan nazorat", "bitimidan chiqdi —", "299-modda bekor."],
    explainFrom: 60.39,
    explainTo: 65.85,
    explain: "Transfert narx ketdi, 299-modda qoldi",
  },
];

export const OUTRO = { from: 67.0, to: DURATION_S };

// Ranglar
export const C = {
  rost: "#2ECC71",
  rostDark: "#1E8E4E",
  yolgon: "#E74C3C",
  yolgonDark: "#A93226",
  accent: "#FFD23F",
  ink: "#12141A",
  paper: "#FFFFFF",
};

export const sec = (s: number) => Math.round(s * FPS);
