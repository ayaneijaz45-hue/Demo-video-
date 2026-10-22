import { useCurrentFrame, useVideoConfig } from "remotion";
import { anim, Arrow, C, Logo, Orbit, Stage } from "../design";

export const Finale = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Stage chapter="08" label="START WITH ONE PROMPT">
      <Orbit size={950} style={{ left: 65, top: 355 }} />
      <Logo
        size={330}
        style={{
          position: "absolute",
          left: 375,
          top: 440,
          scale: anim(f, 0, 45, 0.65, 1),
          filter: "drop-shadow(0 25px 35px #0078FF20)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 86,
          top: 815,
          textAlign: "center",
          fontSize: 64,
          fontWeight: 650,
          letterSpacing: -2,
          opacity: anim(f, 3, 20),
        }}
      >
        Models Suite
      </div>
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 86,
          top: 975,
          textAlign: "center",
          fontSize: 86,
          fontWeight: 650,
          letterSpacing: -4,
          lineHeight: 1.14,
          translate: `0 ${anim(f, 20, 65, 70, 0)}px`,
          opacity: anim(f, 20, 55),
        }}
      >
        Every Leading AI.
        <br />
        <span style={{ color: C.cyan }}>One PKR Wallet.</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 86,
          top: 1275,
          textAlign: "center",
          fontSize: 42,
          color: C.white,
          fontWeight: 500,
          opacity: anim(f, 65, 90),
        }}
      >
        modelssuite.com
      </div>
      <div
        style={{
          position: "absolute",
          left: 265,
          top: 1410,
          width: 550,
          height: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          borderRadius: 100,
          background: C.cyan,
          color: C.ink,
          fontSize: 30,
          fontWeight: 700,
          scale: anim(f, 70, 105, 0.9, 1),
          opacity: anim(f, 70, 100),
        }}
      >
        Create your account <Arrow />
      </div>
    </Stage>
  );
};
