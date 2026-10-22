import {
  Base,
  Brow,
  Cursor,
  k,
  lin,
  Note,
  P,
  Pill,
  Surface,
  SurfaceHeader,
  useTime,
  Word,
} from "../design";

export const BattleReveal = () => {
  const t = useTime();
  const chosen = k(t, 2.25, 2.85);
  const push = k(t, 3.45, 4);
  return (
    <Base light>
      <Brow light style={{ left: 74, top: 130 }}>
        MODEL BATTLE
      </Brow>
      <div
        style={{
          position: "absolute",
          left: 65,
          top: 255,
          transform: `translateY(${k(t, 2.8, 4, 0, -65)}px)`,
        }}
      >
        <Word t={t} size={151}>
          Compare.
        </Word>
        <Word
          t={t}
          at={0.18}
          size={163}
          color={P.blue}
          style={{ marginLeft: 230 }}
        >
          Choose.
        </Word>
      </div>
      <div
        style={{
          position: "absolute",
          left: 74,
          top: 665,
          width: 920,
          opacity: k(t, 0.15, 0.55),
          translate: `0 ${k(t, 0.15, 0.65, 75, 0)}px`,
        }}
      >
        <Surface light>
          <SurfaceHeader light title="Model Battle" />
          <div style={{ padding: "25px 30px", fontSize: 34 }}>
            Write a launch line.
          </div>
          <div style={{ display: "flex", gap: 14, padding: "0 30px 25px" }}>
            <Pill active light>
              GPT ✓
            </Pill>
            <Pill active light>
              Claude ✓
            </Pill>
          </div>
        </Surface>
      </div>
      <div
        style={{
          position: "absolute",
          left: 74,
          top: 1000,
          display: "flex",
          gap: 24,
          perspective: 1400,
        }}
      >
        {["GPT", "Claude"].map((name, i) => (
          <Surface
            light
            key={name}
            style={{
              width: 448,
              height: 445,
              opacity: i === 0 ? 1 - chosen * 0.4 : 1,
              zIndex: i === 1 ? 2 : 1,
              transform: `translate(${i === 1 ? -push * 230 : 0}px,${k(t, 0.55 + i * 0.1, 1.15 + i * 0.1, 180, 0) - chosen * (i === 1 ? 38 : 0)}px) rotateY(${k(t, 0.55, 1.2, i === 0 ? 25 : -25, 0)}deg) scale(${i === 1 ? 1 + chosen * 0.055 + push * 1.4 : 1 - push * 0.3})`,
              background:
                i === 1 && push > 0.15
                  ? `linear-gradient(${P.paper},white)`
                  : undefined,
            }}
          >
            <div
              style={{
                padding: "27px 28px",
                fontSize: 34,
                fontWeight: 700,
                borderBottom: "1px solid #D2E2ED",
              }}
            >
              {name}
              <span style={{ float: "right", fontSize: 19, color: P.blue }}>
                READY
              </span>
            </div>
            <div
              style={{
                padding: 28,
                fontSize: 40,
                fontWeight: 550,
                lineHeight: 1.35,
                letterSpacing: -1,
                clipPath: `inset(0 0 ${100 - k(t, 0.8 + i * 0.1, 1.7 + i * 0.1) * 100}% 0)`,
              }}
            >
              {i === 0 ? (
                <>
                  A new way
                  <br />
                  to create.
                </>
              ) : (
                <>
                  Your ideas.
                  <br />
                  One workspace.
                </>
              )}
            </div>
            <div
              style={{
                position: "absolute",
                left: 24,
                right: 24,
                bottom: 25,
                padding: "19px 20px",
                borderRadius: 18,
                fontSize: 27,
                background: i === 1 ? P.blue : "#EAF3F9",
                color: i === 1 ? P.white : "#577481",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {i === 1 && chosen > 0.5 ? "✓ Winner" : "Choose winner"}
              <span>↗</span>
            </div>
            {i === 1 ? (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 35,
                  border: "3px solid #087EA4",
                  opacity: chosen,
                  boxShadow: "inset 0 0 50px #7EE7FF40",
                }}
              />
            ) : null}
          </Surface>
        ))}
      </div>
      {t > 1.8 && t < 3.4 ? (
        <Cursor
          x={k(t, 1.8, 2.3, 940, 850)}
          y={k(t, 1.8, 2.3, 1540, 1380)}
          click={Math.sin(lin(t, 2.3, 2.6) * Math.PI)}
        />
      ) : null}
      <Note light style={{ bottom: 230, opacity: 1 - push }}>
        Illustrative responses · each model is billed separately
      </Note>
    </Base>
  );
};
