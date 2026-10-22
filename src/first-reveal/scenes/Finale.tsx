import { Base, Brow, k, P, useTime, Word } from "../design";
import { BrandObject } from "../BrandObject";

export const FirstFinale = () => {
  const t = useTime();
  return (
    <Base>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 32%,#1D3F59 0%,#081624 35%,#05070A 70%)",
        }}
      />
      <Brow style={{ top: 135, left: 74 }}>MODELS SUITE</Brow>
      <BrandObject finale />
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 80,
          top: 1110,
          textAlign: "center",
        }}
      >
        <Word t={t} at={0.15} size={91}>
          Every Leading AI.
        </Word>
        <Word t={t} at={0.28} size={111} color={P.cyan}>
          One PKR Wallet.
        </Word>
      </div>
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 80,
          top: 1390,
          textAlign: "center",
          fontSize: 48,
          fontWeight: 500,
          letterSpacing: -1,
          opacity: k(t, 0.8, 1.2),
        }}
      >
        modelssuite.com
      </div>
      <div
        style={{
          position: "absolute",
          top: 1510,
          left: 228,
          width: 624,
          height: 98,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          fontSize: 34,
          fontWeight: 650,
          borderRadius: 100,
          background: P.cyan,
          color: P.ink,
          transform: `translateY(${k(t, 1.05, 1.55, 70, 0)}px)`,
          opacity: k(t, 1.05, 1.45),
        }}
      >
        Create your account <span>↗</span>
      </div>
    </Base>
  );
};
