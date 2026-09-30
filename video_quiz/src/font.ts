import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

export const fontFamily = 'Montserrat, sans-serif';

const loadFonts = () => {
  const handle = delayRender('Shriftlar yuklanmoqda');
  const files: [string, string, string][] = [
    ['600', 'latin', 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122'],
    ['600', 'latin-ext', 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF'],
    ['800', 'latin', 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122'],
    ['800', 'latin-ext', 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF'],
  ];
  Promise.all(
    files.map(async ([weight, subset, range]) => {
      const face = new FontFace(
        'Montserrat',
        `url(${staticFile(`fonts/montserrat-${subset}-${weight}-normal.woff2`)}) format('woff2')`,
        {weight, unicodeRange: range},
      );
      await face.load();
      (document.fonts as unknown as {add: (f: FontFace) => void}).add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => cancelRender(e));
};
loadFonts();
