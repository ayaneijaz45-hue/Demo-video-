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
  const pick = k(t, 2.9, 3.3);
  const settle = k(t, 2.2, 4.5);
  const press = Math.sin(lin(t, 2.9, 3.15) * Math.PI);
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
          transformOrigin: "50% 60%",
          transform: `perspective(1800px) rotateX(${k(t, 0.7, 2.6, 24, 1.2)}deg) rotateY(${k(t, 0.7, 2.6, -13, -1) + settle}deg) translateY(${k(t, 0.7, 2.3, 240, 0) - settle * 12}px) scale(${1 + settle * 0.018})`,
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
                <Pill active style={{ transform: `scale(${1 - press * 0.035})` }}>Auto Best</Pill>
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
                  transform: `translateY(${-pick * 3}px)`,
                }}
              >
                <div style={{ fontSize: 28, color: "#A9BCCC" }}>
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
                <div style={{ fontSize: 26, marginTop: 15, color: "#B6CAD9" }}>
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
            d={`M${x} 660 C${x} 790 600 780 600 1138`}
            fill="none"
            stroke={i % 2 ? P.violet : P.cyan}
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset={1 - route}
            opacity={0.65}
          />
        ))}
      </svg>
      {t > 2.1 && t < 3.7 ? (
        <Cursor
          x={k(t, 2.1, 2.85, 940, 440)}
          y={k(t, 2.1, 2.85, 1400, 1135)}
          click={Math.sin(lin(t, 2.9, 3.3) * Math.PI)}
        />
      ) : null}
      <Note style={{ bottom: 350, right: 180, fontSize: 29 }}>Illustrative interface · model access varies by availability</Note>
    </Base>
  );
};
