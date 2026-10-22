import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";

loadFont({
  family: "RevealGrotesk",
  url: staticFile("fonts/manrope-latin-wght-normal.woff2"),
  weight: "200 800",
});
export const P = {
  ink: "#05070A",
  paper: "#EAF7FC",
  white: "#F5F8FB",
  cyan: "#7EE7FF",
  violet: "#8FA7FF",
  blue: "#087EA4",
  muted: "#8AA1B3",
};
export const FONT = "RevealGrotesk, sans-serif";
const out = Easing.bezier(0.16, 1, 0.3, 1);
export const k = (t: number, a: number, b: number, x = 0, y = 1) =>
  interpolate(t, [a, b], [x, y], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: out,
  });
export const lin = (t: number, a: number, b: number, x = 0, y = 1) =>
  interpolate(t, [a, b], [x, y], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
export const useTime = () => useCurrentFrame() / useVideoConfig().fps;
export const Art = () => staticFile("first-reveal/glass-bloom.png");
export const Mark = ({
  size = 80,
  style = {},
}: {
  size?: number;
  style?: CSSProperties;
}) => (
  <CanvasImage
    src={staticFile("brand/models-suite-logo.png")}
    style={{ width: size, height: size, objectFit: "contain", ...style }}
  />
);
export const Base = ({
  children,
  light = false,
  style = {},
}: {
  children: ReactNode;
  light?: boolean;
  style?: CSSProperties;
}) => (
  <AbsoluteFill
    style={{
      fontFamily: FONT,
      color: light ? P.ink : P.white,
      background: light ? P.paper : P.ink,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);
export const Brow = ({
  children,
  light = false,
  style = {},
}: {
  children: ReactNode;
  light?: boolean;
  style?: CSSProperties;
}) => (
  <div
    style={{
      position: "absolute",
      fontSize: 24,
      fontWeight: 650,
      letterSpacing: 4,
      color: light ? P.blue : P.cyan,
      ...style,
    }}
  >
    {children}
  </div>
);
export const Note = ({
  children,
  light = false,
  style = {},
}: {
  children: ReactNode;
  light?: boolean;
  style?: CSSProperties;
}) => (
  <div
    style={{
      position: "absolute",
      left: 74,
      right: 86,
      bottom: 215,
      fontSize: 26,
      lineHeight: 1.5,
      color: light ? "#4B6472" : "#91A9BA",
      ...style,
    }}
  >
    {children}
  </div>
);
export const Surface = ({
  children,
  light = false,
  style = {},
}: {
  children: ReactNode;
  light?: boolean;
  style?: CSSProperties;
}) => (
  <div
    style={{
      position: "relative",
      background: light
        ? "linear-gradient(130deg,#fff,#F6FBFF)"
        : "linear-gradient(135deg,#203349,#0E1826 65%)",
      borderRadius: 36,
      border: `1px solid ${light ? "#B8CEDB" : "#7189A963"}`,
      boxShadow: light
        ? "0 40px 100px #183C561F,inset 0 2px #fff"
        : "0 60px 140px #000B,inset 0 2px #FFFFFF40",
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);
export const SurfaceHeader = ({
  title,
  light = false,
}: {
  title: string;
  light?: boolean;
}) => (
  <div
    style={{
      height: 86,
      padding: "0 30px",
      display: "flex",
      alignItems: "center",
      gap: 17,
      borderBottom: `1px solid ${light ? "#D2E2ED" : "#627A9340"}`,
      fontSize: 30,
      fontWeight: 650,
    }}
  >
    <Mark size={35} />
    {title}
    <span
      style={{
        marginLeft: "auto",
        fontSize: 19,
        letterSpacing: 3,
        opacity: 0.5,
      }}
    >
      ● ● ●
    </span>
  </div>
);
export const Pill = ({
  children,
  active = false,
  light = false,
  style = {},
}: {
  children: ReactNode;
  active?: boolean;
  light?: boolean;
  style?: CSSProperties;
}) => (
  <div
    style={{
      padding: "14px 24px",
      borderRadius: 100,
      fontSize: 29,
      fontWeight: 650,
      background: active
        ? light
          ? P.blue
          : P.cyan
        : light
          ? "#EAF3F9"
          : "#1B2B3D",
      color: active ? (light ? P.white : P.ink) : light ? "#537080" : "#A8BDCD",
      ...style,
    }}
  >
    {children}
  </div>
);
export const Cursor = ({
  x,
  y,
  click = 0,
}: {
  x: number;
  y: number;
  click?: number;
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 50,
      height: 60,
      filter: "drop-shadow(0 5px 6px #0004)",
      transform: `scale(${1 - click * 0.12})`,
      zIndex: 15,
    }}
  >
    <svg viewBox="0 0 50 60">
      <path
        d="M6 3 9 48 21 35 34 56 44 50 31 31 48 27Z"
        fill="white"
        stroke={P.ink}
        strokeWidth="2"
      />
    </svg>
    {click > 0 && (
      <div
        style={{
          position: "absolute",
          left: -25,
          top: -22,
          width: 85,
          height: 85,
          borderRadius: "50%",
          border: "3px solid #7EE7FF",
          scale: 1 + click * 0.7,
          opacity: 1 - click,
        }}
      />
    )}
  </div>
);
export const LightStreak = ({
  t,
  at = 0,
  angle = -25,
}: {
  t: number;
  at?: number;
  angle?: number;
}) => {
  const p = lin(t, at, at + 0.6, -140, 150);
  return (
    <div
      style={{
        position: "absolute",
        inset: -200,
        background:
          "linear-gradient(90deg,transparent 35%,#FFFFFF55 49%,#7EE7FF99 50%,transparent 57%)",
        transform: `translateX(${p}%) rotate(${angle}deg)`,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    />
  );
};

export const Word = ({
  children,
  t,
  at = 0,
  size = 150,
  color,
  style = {},
}: {
  children: ReactNode;
  t: number;
  at?: number;
  size?: number;
  color?: string;
  style?: CSSProperties;
}) => (
  <div
    style={{
      fontSize: size,
      fontWeight: 650,
      lineHeight: 1.02,
      letterSpacing: -size * 0.065,
      overflow: "hidden",
      color,
      ...style,
    }}
  >
    <div
      style={{
        translate: `0 ${k(t, at, at + 0.55, 110, 0)}%`,
        rotate: `${k(t, at, at + 0.65, 6, 0)}deg`,
        filter: `blur(${k(t, at, at + 0.45, 6, 0)}px)`,
      }}
    >
      {children}
    </div>
  </div>
);
