import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  anim,
  Bar,
  C,
  Headline,
  Logo,
  Panel,
  SampleNote,
  Stage,
  Tag,
} from "../design";

export const Intelligence = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const route = anim(f, 4.1 * fps, 6 * fps);
  return (
    <Stage chapter="03" label="CHOOSE YOUR MODEL. OR GO AUTO.">
      <Headline lines={["Leading AI.", "One workspace."]} size={96} />
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 560,
          fontSize: 29,
          color: C.muted,
        }}
      >
        The right intelligence for your next task.
      </div>
      <svg width="1080" height="1920" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="route" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor={C.violet} />
            <stop offset="1" stopColor={C.cyan} />
          </linearGradient>
        </defs>
        {[195, 420, 645, 870].map((x, i) => (
          <path
            key={x}
            d={`M ${x} 940 C ${x} 1060 540 1040 540 1150`}
            fill="none"
            stroke="url(#route)"
            strokeWidth={2}
            opacity={0.6}
            strokeDasharray={600}
            strokeDashoffset={(1 - route) * 600 + i * 10}
          />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 770,
          display: "flex",
          gap: 20,
        }}
      >
        {["GPT", "Claude", "Gemini", "DeepSeek"].map((m, i) => (
          <Panel
            key={m}
            style={{
              width: 210,
              height: 160,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              translate: `0 ${anim(f, 14 + i * 7, 50 + i * 7, 120, 0)}px`,
              rotate: `${anim(f, 14 + i * 7, 70 + i * 7, (i - 1.5) * 10, 0)}deg`,
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: i % 2 ? "50%" : 8,
                background: i % 2 ? C.violet : C.cyan,
              }}
            />
            <div style={{ fontSize: 25, fontWeight: 650 }}>{m}</div>
          </Panel>
        ))}
      </div>
      <Panel
        style={{
          position: "absolute",
          left: 160,
          top: 1125,
          width: 760,
          scale: anim(f, 55, 100, 0.85, 1),
          boxShadow: `0 0 ${route * 70}px #7EE7FF15, 0 50px 90px #0009`,
        }}
      >
        <Bar title="Choose AI model" />
        <div
          style={{
            padding: "35px 38px",
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <Logo size={72} />
          <div>
            <div style={{ fontSize: 44, fontWeight: 650, color: C.cyan }}>
              Auto Best
            </div>
            <div style={{ fontSize: 24, color: C.muted, marginTop: 12 }}>
              Quality · Speed · Cost · Availability
            </div>
          </div>
          <span style={{ fontSize: 32, marginLeft: "auto", color: C.cyan }}>
            ✓
          </span>
        </div>
      </Panel>
      <Tag
        style={{
          position: "absolute",
          left: 310,
          top: 1435,
          opacity: anim(f, 183, 204),
        }}
      >
        You choose. Or let Auto Best route.
      </Tag>
      <SampleNote
        top={1560}
        text="Illustrative routing · model access varies by availability"
      />
    </Stage>
  );
};
