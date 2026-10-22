import { Trail } from "@remotion/motion-blur";
import {
  Base,
  Brow,
  k,
  lin,
  Mark,
  P,
  Surface,
  SurfaceHeader,
  useTime,
} from "../design";

const Windows = () => {
  const t = useTime();
  const pull = k(t, 1.5, 2.85);
  const turn = k(t, 1.35, 2.9, 0, -25);
  return (
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 1120,
        perspective: 1300,
        transform: `rotateZ(${turn}deg)`,
      }}
    >
      {["Chat", "Images", "GPT", "Voice", "Gemini", "Video"].map((name, i) => {
        const a = (i * Math.PI) / 3 - 0.8;
        const r = 310 + (i % 2) * 70;
        const appear = k(t, i * 0.075, 0.45 + i * 0.075);
        return (
          <Surface
            key={name}
            style={{
              position: "absolute",
              width: 580,
              height: 245,
              left: -290,
              top: -122,
              opacity: appear * (1 - pull),
              transform: `translate3d(${Math.cos(a) * r * (1 - pull)}px,${Math.sin(a) * r * (1 - pull)}px,${(i % 3) * 55}px) rotateY(${(i - 2) * 11 * (1 - pull)}deg) rotateZ(${(i - 2) * 8 * (1 - pull)}deg) scale(${1 - pull * 0.7})`,
            }}
          >
            <SurfaceHeader title={name} />
            <div style={{ padding: 27, display: "flex", gap: 12 }}>
              {[160, 100, 70].map((w, j) => (
                <div
                  key={j}
                  style={{
                    height: 15,
                    width: w,
                    borderRadius: 10,
                    background: j === 0 ? P.cyan : "#455D75",
                  }}
                />
              ))}
            </div>
            <div
              style={{
                height: 12,
                width: 360,
                marginLeft: 27,
                borderRadius: 12,
                background: "#58718B66",
              }}
            />
          </Surface>
        );
      })}
    </div>
  );
};
export const TabStorm = () => {
  const t = useTime();
  const pull = k(t, 1.5, 2.85);
  return (
    <Base>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 62%,#19384D,transparent 64%)",
        }}
      />
      <Brow style={{ left: 74, top: 140 }}>ONE IDEA. TOO MANY PLACES.</Brow>
      <div
        style={{
          position: "absolute",
          left: 65,
          top: 290,
          fontSize: 159,
          fontWeight: 650,
          lineHeight: 1,
          letterSpacing: -12,
          translate: `${k(t, 1.8, 2.95, 0, -75)}px ${k(t, 1.8, 2.95, 0, -80)}px`,
          opacity: 1 - k(t, 2.35, 2.97),
        }}
      >
        Too many
        <br />
        <span style={{ color: P.cyan, fontSize: 194 }}>AI tabs?</span>
      </div>
      <Trail layers={2} lagInFrames={0.35} trailOpacity={0.16}>
        <Windows />
      </Trail>
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 1090,
          translate: "-50% -50%",
          scale: k(t, 2.0, 2.98, 0.1, 1.35),
          opacity: k(t, 2, 2.65),
          filter: `drop-shadow(0 0 ${40 * pull}px #7EE7FF88)`,
        }}
      >
        <Mark size={275} />
      </div>
      <svg
        width="1080"
        height="1920"
        style={{
          position: "absolute",
          opacity: Math.sin(lin(t, 1.8, 2.85) * Math.PI) * 0.7,
        }}
      >
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const r = 480 * (1 - pull);
          return (
            <line
              key={i}
              x1={540 + Math.cos(a) * r}
              y1={1090 + Math.sin(a) * r}
              x2={540 + Math.cos(a) * (r + 65)}
              y2={1090 + Math.sin(a) * (r + 65)}
              stroke={i % 2 ? P.cyan : P.violet}
              strokeWidth={1.5}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: P.white,
          opacity: Math.sin(lin(t, 2.86, 3) * Math.PI) * 0.7,
        }}
      />
    </Base>
  );
};
