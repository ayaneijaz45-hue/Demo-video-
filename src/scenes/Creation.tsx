import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  anim,
  Arrow,
  Bar,
  C,
  Headline,
  Panel,
  SampleNote,
  Stage,
} from "../design";
import { ConceptArt } from "../components/ConceptArt";

export const Creation = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mode = f < 2.4 * fps ? 0 : f < 5.5 * fps ? 1 : f < 8.7 * fps ? 2 : 3;
  const names = ["Chat", "Images", "Video", "Voice"];
  const phase = f - [0, 2.4 * fps, 5.5 * fps, 8.7 * fps][mode];
  return (
    <Stage chapter="05" label="ONE IDEA. EVERY DIRECTION.">
      <Headline lines={["From ideas", "to creation."]} size={104} />
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 570,
          display: "flex",
          gap: 12,
        }}
      >
        {names.map((n, i) => (
          <div
            key={n}
            style={{
              padding: "17px 29px",
              borderRadius: 100,
              background: i === mode ? C.cyan : "#132535",
              color: i === mode ? C.ink : C.muted,
              fontSize: 25,
              fontWeight: 700,
            }}
          >
            {n}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 76,
          top: 760,
          width: 900,
          perspective: 1800,
          transform: `rotateY(${Math.sin(f / 75) * 2}deg) rotateX(${Math.cos(f / 80) * 1.6}deg)`,
        }}
      >
        <Panel style={{ height: 715 }}>
          <Bar
            title={
              mode === 0
                ? "Models Suite"
                : mode === 1
                  ? "Create Images"
                  : mode === 2
                    ? "Video Studio"
                    : "Audio Studio"
            }
          />
          <div
            style={{
              padding: 30,
              translate: `${anim(phase, 0, 18, 45, 0)}px 0`,
              opacity: anim(phase, 0, 14),
            }}
          >
            {mode === 0 ? (
              <>
                <div
                  style={{ fontSize: 42, fontWeight: 600, margin: "35px 5px" }}
                >
                  What will you create today?
                </div>
                <div
                  style={{
                    fontSize: 27,
                    color: C.muted,
                    marginTop: 25,
                    lineHeight: 1.6,
                  }}
                >
                  Start with a thought.
                  <br />
                  Give it somewhere to go.
                </div>
                <div
                  style={{
                    background: "#213546",
                    borderRadius: 24,
                    padding: 30,
                    marginTop: 55,
                    fontSize: 27,
                  }}
                >
                  A new perspective on my next launch.
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 23,
                    color: C.cyan,
                    marginTop: 30,
                  }}
                >
                  <span>✦ Auto (best match)</span>
                  <Arrow />
                </div>
              </>
            ) : mode === 3 ? (
              <>
                <div style={{ fontSize: 22, color: C.cyan, letterSpacing: 3 }}>
                  TEXT TO SPEECH
                </div>
                <div style={{ fontSize: 35, marginTop: 22, lineHeight: 1.5 }}>
                  “A new perspective.
                  <br />
                  An idea worth sharing.”
                </div>
                <div
                  style={{
                    height: 170,
                    marginTop: 45,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                  }}
                >
                  {Array.from({ length: 55 }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 7,
                        borderRadius: 6,
                        height:
                          18 +
                          Math.abs(Math.sin(i * 0.67 + f * 0.18)) *
                            110 *
                            (0.35 + Math.sin((i / 54) * Math.PI) * 0.65),
                        background: `linear-gradient(${C.cyan},${C.violet})`,
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    fontSize: 24,
                    color: C.muted,
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 15,
                  }}
                >
                  <span>Choose voice</span>
                  <span>Generate audio ↗</span>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    height: 370,
                    borderRadius: 18,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <ConceptArt mode={mode === 2 ? "video" : "image"} />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 16,
                      left: 18,
                      fontSize: 17,
                      color: C.white,
                      background: "#05070AB0",
                      borderRadius: 30,
                      padding: "7px 13px",
                    }}
                  >
                    Original concept artwork
                  </div>
                  {mode === 2 && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: "50%",
                          background: "#EAF7FCBB",
                          color: C.ink,
                          display: "grid",
                          placeItems: "center",
                          fontSize: 32,
                        }}
                      >
                        ▶
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 25, marginTop: 24 }}>
                  Explore an abstract sculptural world.
                </div>
                <div
                  style={{ height: 3, marginTop: 24, background: "#243A4C" }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${anim(phase, 0, 70) * 100}%`,
                      background: C.cyan,
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 22,
                    color: C.muted,
                    fontSize: 22,
                  }}
                >
                  <span>
                    {mode === 2
                      ? "Text to video · 5s"
                      : "Prompt · Choose model"}
                  </span>
                  <span>
                    {mode === 2 ? "Generate Video" : "Generate image"} ↗
                  </span>
                </div>
              </>
            )}
          </div>
        </Panel>
      </div>
      <SampleNote
        text="Illustrative workflows · concept art is not a product output"
        top={1540}
      />
    </Stage>
  );
};
