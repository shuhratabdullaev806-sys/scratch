// Manba: HeyGen WebM, shaffof fon (VP9 + alpha), 1080x1920, 25fps, 52.17s.
//
// HeyGen pauzalarni 1.4-1.8 soniya qilib qo'ygan, 3 emas. Shuning uchun
// har pauzaning o'rtasiga muzlatilgan kadr qo'yib, 3 soniyaga cho'zamiz.
// Quyidagi vaqtlar CHIQISH vaqtlari (cho'zilgandan keyingi).

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export type Answer = "ROST" | "YOLGON";

/** Manbadagi pauza o'rtasi va qancha muzlatish qo'shilishi. */
export type Freeze = { at: number; hold: number; img: string };

export const FREEZES: Freeze[] = [
  { at: 12.41, hold: 1.24, img: "muzlash1.png" },
  { at: 26.46, hold: 1.56, img: "muzlash2.png" },
  { at: 40.95, hold: 1.56, img: "muzlash3.png" },
];

export const SOURCE_S = 52.17;
export const DURATION_S =
  SOURCE_S + FREEZES.reduce((s, f) => s + f.hold, 0); // 56.53

export type Question = {
  n: number;
  answer: Answer;
  labelAt: number;
  textFrom: number;
  pauseFrom: number;
  pauseTo: number;
  screenText: string[];
  explainFrom: number;
  explainTo: number;
  explain: string;
  calc?: { lines: string[]; from: number; to: number };
};

export const INTRO = { from: 0, to: 4.28 };

/** Intro va outro yozuvlari — har videoda shu yerdan o'zgartiriladi. */
export const TITLES = {
  introBig: ["AVTOMOBIL QQSi —", "ZACHETMI?"],
  introSmall: "SK 266 va 267 — 3 savol",
  outroBig: ["Nechta to'g'ri", "topdingiz?"],
  outroCta: "Izohda yozing",
  outroSub: "🔔 Obuna bo'ling",
};

export const QUESTIONS: Question[] = [
  {
    n: 1,
    answer: "YOLGON",
    labelAt: 4.9,
    textFrom: 5.99,
    pauseFrom: 11.53,
    pauseTo: 14.53,
    screenText: ["Avtomobil QQSini", "zachetga olib", "bo'lmaydi."],
    explainFrom: 16.18,
    explainTo: 20.68,
    explain: "266-modda ruxsat beradi — biznesda ishlatilsa",
  },
  {
    n: 2,
    answer: "ROST",
    labelAt: 21.22,
    textFrom: 22.33,
    pauseFrom: 26.98,
    pauseTo: 29.98,
    screenText: ["Zachet uchun to'rtta", "hujjat kerak. Bittasi", "yetishmasa — tushadi."],
    explainFrom: 31.51,
    explainTo: 37.71,
    explain: "Yo'l varaqasi, ETTN, YOMM akti va buyruq",
  },
  {
    n: 3,
    answer: "YOLGON",
    labelAt: 38.19,
    textFrom: 39.26,
    pauseFrom: 43.03,
    pauseTo: 46.03,
    screenText: ["200 mln avtomobilda", "ikkala yo'l ham", "bir xil naf beradi."],
    explainFrom: 47.61,
    explainTo: 52.36,
    explain: "Zachet 24 mln qaytaradi, tannarx yo'li 3,6 mln",
    calc: {
      lines: ["Zachet: 24 mln qaytadi", "Tannarx: 3,6 mln tejam"],
      from: 47.61,
      to: 52.6,
    },
  },
];

export const OUTRO = { from: 52.9, to: DURATION_S };

// Fon kayfiyati: savolda sariq, javob ochilgach ko'k.
export const BLUE_WINDOWS: [number, number][] = QUESTIONS.map((q, i) => [
  q.pauseTo,
  i + 1 < QUESTIONS.length ? QUESTIONS[i + 1].labelAt - 0.5 : DURATION_S,
]);

// Sariq pasaytirilgan — yorqin to'q sariq yuzni sarg'aytirar va Instagram
// siqilishida dog'lanardi. Ko'k esa yorqinligicha qoldirildi: u siqilishda
// toza chiqadi va lentada e'tiborni tortadi.
export const MOOD = {
  warmA: "#D9942E",
  warmB: "#A8600F",
  coolA: "#12A0C4",
  coolB: "#06394B",
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
