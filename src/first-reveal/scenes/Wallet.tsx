import {
  Base,
  Brow,
  k,
  lin,
  Note,
  P,
  Surface,
  SurfaceHeader,
  useTime,
  Word,
} from "../design";

export const WalletReveal = () => {
  const t = useTime();
  const resolve = k(t, 0.55, 1.5);
  return (
    <Base light>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 80% 40%,white,transparent 70%)",
        }}
      />
      <Brow light style={{ left: 74, top: 135 }}>
        ONE WALLET. YOUR CURRENCY.
      </Brow>
      <div style={{ position: "absolute", left: 68, top: 280 }}>
        <Word t={t} at={0} size={97}>
          Clear costs.
        </Word>
        <Word t={t} at={0.12} size={113} color={P.blue}>
          Local simplicity.
        </Word>
      </div>
      <div
        style={{
          position: "absolute",
          left: 68,
          top: 630,
          right: 80,
          perspective: 1200,
          display: "flex",
          alignItems: "baseline",
          gap: 24,
        }}
      >
        <div
          style={{
            fontSize: 274,
            fontWeight: 600,
            letterSpacing: -23,
            color: P.blue,
            transform: `rotateX(${k(t, 0.05, 0.85, 85, 0)}deg) translateY(${k(t, 0.05, 0.85, 80, 0)}px)`,
            transformOrigin: "50% 100%",
          }}
        >
          ₨1
        </div>
        <div
          style={{
            fontSize: 80,
            alignSelf: "center",
            color: "#91ACBB",
            opacity: resolve,
          }}
        >
          =
        </div>
        <div
          style={{
            fontSize: 215,
            fontWeight: 600,
            letterSpacing: -15,
            transform: `translateX(${k(t, 0.45, 1.25, 190, 0)}px)`,
            opacity: resolve,
          }}
        >
          1
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 671,
          top: 925,
          fontSize: 57,
          fontWeight: 600,
          color: P.blue,
          opacity: resolve,
        }}
      >
        Credit
      </div>
      <Surface
        light
        style={{
          position: "absolute",
          left: 74,
          top: 1130,
          width: 920,
          transform: `translateY(${k(t, 1.25, 2.1, 220, 0)}px) rotateX(${k(t, 1.25, 2.1, 12, 0)}deg)`,
          opacity: k(t, 1.25, 1.9),
        }}
      >
        <SurfaceHeader light title="PKR wallet" />
        <div style={{ padding: "30px 34px", fontSize: 32, lineHeight: 1.55 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Media estimate</span>
            <strong style={{ color: P.blue }}>Before generation</strong>
          </div>
          <div style={{ fontSize: 27, color: "#587280", marginTop: 18 }}>
            Final charge follows completed provider cost.
            <br />
            Unused authorization is released.
          </div>
        </div>
      </Surface>
      <Note light>Current credit policy · illustrative wallet interface</Note>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: P.ink,
          clipPath: `circle(${lin(t, 3.72, 4, 0, 130)}% at 50% 48%)`,
        }}
      />
    </Base>
  );
};
