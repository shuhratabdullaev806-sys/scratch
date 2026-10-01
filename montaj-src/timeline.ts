// Manba: HeyGen MP4, fon tegilmaydi, 608x1080, 25fps, 54.61s.
// Pauzalar HeyGen'da 2.8-3.1 soniya chiqqan — qisqartirish kerak emas.
//
// Format: 5 savol. Diktor javobni AYTMAYDI, lekin javob EKRANDA ko'rinadi —
// pauza tugagach to'g'ri tugma yonadi. Qisqa ko'rinadi, shuning uchun
// ilg'amagan odam videoni qayta ko'radi. Izohda esa to'liq tushuntirish.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const SOURCE_S = 54.61;
export const ENDCARD_S = 3.0;
export const DURATION_S = SOURCE_S + ENDCARD_S;

export type Answer = "ROST" | "YOLGON";

/** Javob tugmasi yonib turadigan vaqt (pauza tugagandan keyin). */
export const REVEAL_S = 1.1;

export type Question = {
  n: number;
  answer: Answer;
  labelAt: number; // "Birinchi." aytilgan payt
  textFrom: number; // savol matni chiqadi
  pauseFrom: number; // jimlik boshlanishi -> taymer
  pauseTo: number; // jimlik tugashi -> matn ketadi
  screenText: string[];
};

export const INTRO = { from: 0, to: 3.65 };

export const QUESTIONS: Question[] = [
  {
    n: 1,
    answer: "YOLGON",
    labelAt: 4.63,
    textFrom: 5.66,
    pauseFrom: 10.71,
    pauseTo: 13.55,
    screenText: ["Debet majburiyatni", "oshiradi"],
  },
  {
    n: 2,
    answer: "ROST",
    labelAt: 13.55,
    textFrom: 14.86,
    pauseFrom: 19.89,
    pauseTo: 22.94,
    screenText: ["Aylanma qaydnomada", "debet = kredit"],
  },
  {
    n: 3,
    answer: "YOLGON",
    labelAt: 22.94,
    textFrom: 24.12,
    pauseFrom: 28.24,
    pauseTo: 31.33,
    screenText: ["Xususiy kapital", "o'zgarmaydi"],
  },
  {
    n: 4,
    answer: "ROST",
    labelAt: 31.37,
    textFrom: 32.82,
    pauseFrom: 37.68,
    pauseTo: 40.72,
    screenText: ["Daromad ishlab", "topilganda tan olinadi"],
  },
  {
    n: 5,
    answer: "YOLGON",
    labelAt: 40.72,
    textFrom: 41.93,
    pauseFrom: 47.78,
    pauseTo: 50.6,
    screenText: ["Dasturlarda jurnal", "yozuvlari yo'q"],
  },
];

// Outro oxirgi javob ko'rinib bo'lgach chiqadi.
export const OUTRO = { from: 51.9, to: SOURCE_S };

export const TITLES = {
  introBig: ["BUXGALTERIYA", "ASOSLARI"],
  introSmall: "5 savol — javoblar izohda",
  outroBig: ["Nechtasini", "topdingiz?"],
  outroCta: "Javoblar izohda",
  outroSub: "Obuna bo'ling",
};

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
