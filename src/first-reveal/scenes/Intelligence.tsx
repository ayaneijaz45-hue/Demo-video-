import {
  Base,
  Brow,
  Cursor,
  k,
  lin,
  Mark,
  Note,
  P,
  Pill,
  Surface,
  SurfaceHeader,
  useTime,
  Word,
} from "../design";

export const IntelligenceReveal = () => {
  const t = useTime();
  const route = lin(t, 2.2, 3.3);
  const pick = k(t, 2.7, 3.1);
  return (
    <Base>
      <Brow style={{ top: 130, left: 74 }}>INTELLIGENCE, CONNECTED</Brow>
      <div style={{ position: "absolute", left: 68, top: 250 }}>
        <Word t={t} at={0} size={142}>
          Leading AI.
        </Word>
        <Word t={t} at={0.12} size={99} color={P.cyan}>
          One workspace.
        </Word>
      </div>
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 730,
          width: 0,
          height: 0,
          perspective: 1300,
        }}
      >
        {["GPT", "Claude", "Gemini", "DeepSeek"].map((name, i) => {
          const x = [-320, 20, 285, -100][i],
            y = [-70, -150, -45, 100][i];
          const collect = k(t, 1.1, 2.3);
          return (
            <div
              key={name}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                fontSize: i === 3 ? 47 : 66,
                fontWeight: 600,
                letterSpacing: -2,
                color: i % 2 ? P.violet : P.white,
                opacity: k(t, 0.1 + i * 0.12, 0.6 + i * 0.12) * (1 - collect),
                transform: `translate(${x * (1 - collect) - 100}px,${y * (1 - collect)}px) rotate(${(i - 1.5) * 7 * (1 - collect)}deg) scale(${1 - collect * 0.75})`,
              }}
            >
              {name}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 770,
          width: 910,
          perspective: 1500,
          transform: `rotateX(${k(t, 0.7, 2.6, 24, 0)}deg) rotateY(${k(t, 0.7, 2.6, -13, 0)}deg) translateY(${k(t, 0.7, 2.3, 240, 0)}px)`,
          opacity: k(t, 0.7, 1.6),
        }}
      >
        <Surface>
          <SurfaceHeader title="Models Suite" />
          <div style={{ display: "flex", height: 560 }}>
            <div
              style={{
                width: 95,
                borderRight: "1px solid #627A9340",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 38,
                paddingTop: 45,
                color: "#8CAAC1",
                fontSize: 31,
              }}
            >
              <span style={{ color: P.cyan }}>✦</span>
              <span>▧</span>
              <span>▷</span>
              <span>≋</span>
            </div>
            <div style={{ padding: 34, flex: 1 }}>
              <div style={{ fontSize: 43, fontWeight: 600, lineHeight: 1.25 }}>
                What will you
                <br />
                create today?
              </div>
              <div style={{ fontSize: 27, color: P.muted, marginTop: 18 }}>
                Choose your model. Or go Auto.
              </div>
              <div style={{ marginTop: 30, display: "flex", gap: 12 }}>
                <Pill active>Auto Best</Pill>
                <Pill>GPT</Pill>
                <Pill>Claude</Pill>
              </div>
              <div
                style={{
                  marginTop: 30,
                  padding: 26,
                  border: `1px solid ${pick > 0.2 ? "#7EE7FF" : "#526C85"}`,
                  borderRadius: 21,
                  background: "#0A1622",
                  boxShadow: `0 0 ${pick * 45}px #7EE7FF19`,
                }}
              >
                <div style={{ fontSize: 24, color: P.muted }}>
                  Choose AI model
                </div>
                <div
                  style={{
                    fontSize: 43,
                    color: P.cyan,
                    fontWeight: 650,
                    marginTop: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 15,
                  }}
                >
                  <Mark size={46} />
                  Auto Best{" "}
                  <span style={{ marginLeft: "auto", opacity: pick }}>✓</span>
                </div>
                <div style={{ fontSize: 24, marginTop: 15, color: "#A9BCCC" }}>
                  Quality · Speed · Cost · Availability
                </div>
              </div>
            </div>
          </div>
        </Surface>
      </div>
      <svg
        width="1080"
        height="1920"
        style={{
          position: "absolute",
          pointerEvents: "none",
          opacity: k(t, 1.8, 2.2) * (1 - k(t, 3.3, 3.8)),
        }}
      >
        {[210, 435, 660, 885].map((x, i) => (
          <path
            key={x}
            d={`M${x} 660 C${x} 810 740 800 740 1100`}
            fill="none"
            stroke={i % 2 ? P.violet : P.cyan}
            strokeWidth="3"
            strokeDasharray="700"
            strokeDashoffset={700 * (1 - route)}
          />
        ))}
      </svg>
      {t > 2.1 && t < 3.7 ? (
        <Cursor
          x={k(t, 2.1, 2.85, 940, 835)}
          y={k(t, 2.1, 2.85, 1400, 1125)}
          click={Math.sin(lin(t, 2.9, 3.3) * Math.PI)}
        />
      ) : null}
      <Note>Illustrative interface · model access varies by availability</Note>
    </Base>
  );
};
