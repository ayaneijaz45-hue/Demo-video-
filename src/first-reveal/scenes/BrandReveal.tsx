import { Base, Brow, k, LightStreak, Mark, P, useTime, Word } from "../design";
import { BrandObject } from "../BrandObject";

export const BrandReveal = () => {
  const t = useTime();
  return (
    <Base>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 42%,#1A3D58 0%,#0A1827 35%,#05070A 68%)",
        }}
      />
      <Brow style={{ top: 145, left: 74 }}>A NEW CENTER FOR YOUR IDEAS</Brow>
      <div
        style={{
          position: "absolute",
          left: 130,
          top: 1070,
          width: 820,
          height: 180,
          borderRadius: "50%",
          background: "radial-gradient(ellipse,#7EE7FF44,transparent 65%)",
          transform: "perspective(900px) rotateX(62deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 370,
          top: 1010,
          transform: "scaleY(-.3)",
          opacity: 0.13,
          filter: "blur(9px)",
        }}
      >
        <Mark size={350} />
      </div>
      <BrandObject />
      <div style={{ position: "absolute", left: 74, top: 1120, right: 80 }}>
        <Word t={t} at={0.12} size={97}>
          Meet
        </Word>
        <Word t={t} at={0.28} size={143} color={P.cyan}>
          Models Suite.
        </Word>
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 1440,
          fontSize: 32,
          color: "#A0BACD",
          letterSpacing: 1,
          opacity: k(t, 0.8, 1.3),
        }}
      >
        One connected workspace.
      </div>
      <LightStreak t={t} at={0.55} />
    </Base>
  );
};
