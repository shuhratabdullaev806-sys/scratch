// Barcha vaqtlar soniyada, manba videodan silencedetect orqali olingan.
export const FPS = 30;
export const DURATION_S = 68.05;
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
    pauseFrom: 11.74,
    pauseTo: 13.94,
    screenText: ["Foizsiz qarz —", "qaytariladigan pul.", "Soliq chiqmaydi."],
    explainFrom: 16.0,
    explainTo: 20.78,
    explain: "Buxgalteriyada daromad yo'q — soliq hisobida bor",
  },
  {
    n: 2,
    answer: "ROST",
    labelAt: 22.03,
    textFrom: 23.21,
    pauseFrom: 31.82,
    pauseTo: 34.0,
    screenText: ["100 mln foizsiz qarz.", "MB stavkasi 14%.", "Daromadga 14 mln."],
    explainFrom: 36.1,
    explainTo: 39.94,
    explain: "15% foyda solig'i — 2 100 000 so'm",
    calc: {
      lines: ["100 mln × 14% = 14 mln", "14 mln × 15% = 2,1 mln"],
      from: 36.1,
      to: 40.6,
    },
  },
  {
    n: 3,
    answer: "YOLGON",
    labelAt: 41.06,
    textFrom: 42.3,
    pauseFrom: 51.06,
    pauseTo: 53.54,
    screenText: ["2026-yildan nazorat", "bitimidan chiqdi —", "299-modda bekor."],
    explainFrom: 57.39,
    explainTo: 62.87,
    explain: "Transfert narx ketdi, 299-modda qoldi",
  },
];

export const OUTRO = { from: 64.0, to: DURATION_S };

// Fon kayfiyati: savol berilayotganda sariq, javob ochilgach ko'k.
// Ko'k oyna: javob ochilgan paytdan keyingi savol boshlanishigacha.
export const BLUE_WINDOWS: [number, number][] = QUESTIONS.map((q, i) => [
  q.pauseTo,
  i + 1 < QUESTIONS.length ? QUESTIONS[i + 1].labelAt - 0.5 : DURATION_S,
]);

export const MOOD = {
  // sariq — savol va o'ylash payti
  warmA: "#FFC21A",
  warmB: "#FF8A00",
  // ko'k — javob va izoh payti
  coolA: "#12A0C4",
  coolB: "#06394B",
};

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
