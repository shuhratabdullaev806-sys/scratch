import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {fontFamily} from './font';
import type {Outro} from './types';

const useEnter = (delay: number, damping = 15) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, stiffness: 110}});
};

const PinIcon: React.FC = () => (
  <svg width="72" height="72" viewBox="0 0 24 24" style={{flexShrink: 0}}>
    <path
      d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
      fill="#ef4444"
    />
  </svg>
);

const PhoneIcon: React.FC = () => (
  <svg width="72" height="72" viewBox="0 0 24 24" style={{flexShrink: 0}}>
    <path
      d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"
      fill="#22c55e"
    />
  </svg>
);

/** Yakuniy ekran: oxirgi kadrda to'liq ko'rinib turadi (chiqish animatsiyasi yo'q). */
export const OutroScene: React.FC<{outro: Outro}> = ({outro}) => {
  const bg = useEnter(0, 20);
  const logo = useEnter(6, 11);
  const person = useEnter(14);
  const title = useEnter(20);
  const addr = useEnter(24);
  const phone = useEnter(32);

  const rise = (p: number) => ({
    opacity: p,
    transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px)`,
  });

  return (
    <AbsoluteFill
      style={{
        opacity: bg,
        background: 'radial-gradient(circle at 50% 30%, #1e3a8a 0%, #0b1020 60%, #05070f 100%)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 70px',
      }}
    >
      <Img
        src={staticFile('logo.svg')}
        style={{
          width: 200,
          height: 200,
          transform: `scale(${logo})`,
          filter: 'drop-shadow(0 0 50px #4361eeaa)',
        }}
      />
      <div
        style={{
          fontFamily,
          fontWeight: 600,
          fontSize: 40,
          color: '#93c5fd',
          textAlign: 'center',
          marginTop: 56,
          ...rise(person),
        }}
      >
        {outro.role}
        <div style={{fontWeight: 800, fontSize: 72, color: '#fff', marginTop: 8}}>{outro.name}</div>
      </div>
      <div
        style={{
          fontFamily,
          fontWeight: 800,
          fontSize: 76,
          color: '#fff',
          textAlign: 'center',
          lineHeight: 1.1,
          marginTop: 28,
          ...rise(title),
        }}
      >
        {outro.company}
      </div>
      <div style={{width: '100%', marginTop: 64, display: 'flex', flexDirection: 'column', gap: 32}}>
        <div style={{...card, ...rise(addr)}}>
          <PinIcon />
          <div>
            <div style={label}>Manzil</div>
            <div style={value}>{outro.address}</div>
          </div>
        </div>
        <div style={{...card, alignItems: 'center', ...rise(phone)}}>
          <PhoneIcon />
          <div>
            <div style={label}>Tel</div>
            <div style={{...value, fontSize: 64, fontWeight: 800}}>{outro.phone}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const card: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 30,
  padding: '36px 44px',
  borderRadius: 40,
  background: 'rgba(10,16,38,0.8)',
  border: '2px solid rgba(148,163,184,0.3)',
};

const label: React.CSSProperties = {
  fontFamily,
  fontWeight: 600,
  fontSize: 32,
  color: '#94a3b8',
  letterSpacing: 2,
  textTransform: 'uppercase',
};

const value: React.CSSProperties = {
  fontFamily,
  fontWeight: 600,
  fontSize: 46,
  color: '#f8fafc',
  lineHeight: 1.3,
  marginTop: 6,
};
