import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const FONT = "Montserrat, Arial Black, sans-serif";

export const ENDCARD = {
  hold: 3.0,
  brand: "Faxr Madad Konsalt",
  // Satrlar qo'lda bo'lingan — so'zlar noo'rin joydan ajralmasin.
  address: "Jizzax viloyati, Jizzax shahri,\nXalqobod MFY,\nMustaqillik ko'chasi, 1-uy",
  phone: "+998976448800",
  /** public/ ichidagi logotip fayli. Yo'q bo'lsa vaqtinchalik belgi chiziladi. */
  logo: null as string | null,
  bg: "#0D1B24",
  bgDeep: "#07121A",
  accent: "#FFD23F",
  ink: "#FFFFFF",
};

/* Chizilgan belgilar — emoji ishlatilmaydi, har qurilmada bir xil ko'rinsin. */

const PinIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
  </svg>
);

const PhoneIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

/** Logotip hali yo'q — o'rniga nozik urg'u belgisi turadi. */
const LogoMark: React.FC = () => (
  <svg width={150} height={150} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="44" stroke={`${ENDCARD.accent}55`} strokeWidth="3" />
    <circle cx="50" cy="50" r="33" stroke={`${ENDCARD.accent}AA`} strokeWidth="5" />
    <path d="M34 52l11 11 21-24" stroke={ENDCARD.accent} strokeWidth="8"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;

  const rise = (delay: number) =>
    spring({ frame: frame - delay * fps, fps, config: { damping: 14, stiffness: 150, mass: 0.7 } });

  // Butun davomida sekin kattalashish — kadr qotib qolmasin.
  const drift = interpolate(frame, [0, durationInFrames], [1, 1.05]);
  const logoIn = rise(0.05);
  const glow = 0.5 + 0.5 * Math.sin(t * Math.PI);

  const Line: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
    const s = rise(delay);
    return (
      <div style={{ transform: `translateY(${(1 - s) * 44}px)`, opacity: Math.min(1, s * 1.5) }}>
        {children}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ background: ENDCARD.bgDeep, overflow: "hidden" }}>
      {/* fon — sekin suzuvchi yorug'lik */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(70% 42% at 50% ${32 + Math.sin(t * 0.9) * 3}%, ${ENDCARD.bg} 0%, ${ENDCARD.bgDeep} 72%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(42% 26% at 50% 30%, ${ENDCARD.accent}${glow > 0.5 ? "26" : "18"} 0%, transparent 70%)`,
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "0 90px",
          gap: 34,
        }}
      >
        {/* logotip */}
        <div
          style={{
            transform: `scale(${(0.6 + logoIn * 0.4) * drift})`,
            filter: `drop-shadow(0 0 ${30 * glow}px ${ENDCARD.accent}55)`,
          }}
        >
          {ENDCARD.logo ? (
            <Img src={staticFile(ENDCARD.logo)} style={{ width: 330, objectFit: "contain" }} />
          ) : (
            <LogoMark />
          )}
        </div>

        {/* nom */}
        <Line delay={0.3}>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: ENDCARD.logo ? 76 : 86,
              letterSpacing: -1,
              color: ENDCARD.ink,
              textAlign: "center",
              textShadow: "0 6px 24px rgba(0,0,0,.5)",
            }}
          >
            {ENDCARD.brand}
          </div>
        </Line>

        {/* ajratuvchi chiziq */}
        <Line delay={0.45}>
          <div
            style={{
              width: 180,
              height: 6,
              borderRadius: 3,
              background: ENDCARD.accent,
            }}
          />
        </Line>

        {/* manzil */}
        <Line delay={0.62}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
              background: "rgba(255,255,255,.07)",
              border: "2px solid rgba(255,255,255,.12)",
              borderRadius: 26,
              padding: "26px 36px",
              maxWidth: 940,
            }}
          >
            <div style={{ marginTop: 4, flexShrink: 0 }}>
              <PinIcon size={52} color={ENDCARD.accent} />
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 38,
                lineHeight: 1.34,
                whiteSpace: "pre-line",
                color: ENDCARD.ink,
                whiteSpace: "pre-line",
              }}
            >
              {ENDCARD.address}
            </div>
          </div>
        </Line>

        {/* telefon */}
        <Line delay={0.82}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              background: ENDCARD.accent,
              borderRadius: 26,
              padding: "22px 44px",
            }}
          >
            <PhoneIcon size={50} color="#12141A" />
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 54,
                color: "#12141A",
                letterSpacing: 0.5,
              }}
            >
              {ENDCARD.phone}
            </div>
          </div>
        </Line>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
