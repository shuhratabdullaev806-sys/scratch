export type CaptionLine = {
  text: string;
  startMs: number;
  endMs: number;
};

// Estimated timing, proportional to word count over the measured 37.8s
// clip. Replace with real transcript timestamps once available.
export const captionLines: CaptionLine[] = [
  { text: "Kameral tekshiruvda buxgalteringiz inspektor so'ragan hujjatni topshirdi.", startMs: 0, endMs: 2973 },
  { text: "Qonunga ko'ra buni talab qilish TAQIQLANGAN edi.", startMs: 2973, endMs: 5947 },
  { text: "Soliq Kodeksi 138-modda aniq yozib qo'ygan:", startMs: 5947, endMs: 8495 },
  { text: "boshlang'ich hujjatlar, registrlar TALAB QILINMAYDI.", startMs: 8495, endMs: 11893 },
  { text: "Lekin buxgalter buni bilmasa — o'zi olib boradi.", startMs: 11893, endMs: 15291 },
  { text: "Inspektor hujjat so'rasa — bitta gap yetarli:", startMs: 15291, endMs: 17840 },
  { text: "«Soliq Kodeksi 138-moddasiga asosan kameral tekshiruvda", startMs: 17840, endMs: 20388 },
  { text: "hujjatlarni talab qilish taqiqlangan.", startMs: 20388, endMs: 22087 },
  { text: "Rasmiy xat yuboring.»", startMs: 22087, endMs: 23362 },
  { text: "Telegramda yoki telefonda javob bermang —", startMs: 23362, endMs: 25485 },
  { text: "faqat rasmiy yozishmalar.", startMs: 25485, endMs: 26760 },
  { text: "Agar bosim davom etsa —", startMs: 26760, endMs: 28459 },
  { text: "soliq organining xavfsizlik xizmatiga murojaat qiling.", startMs: 28459, endMs: 31007 },
  { text: "Namuna matni bor — izohda so'rang.", startMs: 31007, endMs: 33131 },
  { text: "Buxgalteringiz kameral tekshiruvga tayyor emasmi?", startMs: 33131, endMs: 35255 },
  { text: "Izohda XIZMAT deb yozing —", startMs: 35255, endMs: 36954 },
  { text: "diagnostika qilamiz.", startMs: 36954, endMs: 37803 },
];

// Window where the full-screen motion-graphic insert replaces the
// video + captions (the "138-modda" law citation).
export const lawShieldInsert = {
  startMs: 5947,
  endMs: 11893,
};
