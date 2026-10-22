import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  anim,
  Bar,
  C,
  Headline,
  Panel,
  SampleNote,
  Stage,
  Tag,
} from "../design";

export const Pricing = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Stage light chapter="06" label="A WALLET THAT SPEAKS YOUR CURRENCY">
      <Headline light lines={["Simple credits.", "Clear costs."]} size={100} />
      <div
        style={{
          position: "absolute",
          top: 665,
          left: 72,
          right: 86,
          display: "flex",
          alignItems: "center",
          gap: 32,
          translate: `0 ${anim(f, 100, 140, 80, 0)}px`,
          opacity: anim(f, 95, 120),
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 180,
              lineHeight: 1,
              fontWeight: 650,
              letterSpacing: -12,
            }}
          >
            1
          </div>
          <div style={{ fontSize: 31, color: C.accent, marginTop: 20 }}>
            Models Suite credit
          </div>
        </div>
        <div
          style={{ fontSize: 76, color: "#8DA5B4", opacity: anim(f, 115, 145) }}
        >
          =
        </div>
        <div style={{ flex: 1, textAlign: "right", opacity: anim(f, 125, 160) }}>
          <div
            style={{
              fontSize: 160,
              lineHeight: 1,
              fontWeight: 650,
              letterSpacing: -9,
              color: C.accent,
            }}
          >
            ₨1
          </div>
          <div style={{ fontSize: 31, color: C.accent, marginTop: 20 }}>
            Pakistani rupee
          </div>
        </div>
      </div>
      <Panel
        light
        style={{
          position: "absolute",
          left: 72,
          top: 1050,
          width: 908,
          translate: `0 ${anim(f, 20, 60, 130, 0)}px`,
          opacity: anim(f, 18, 55),
        }}
      >
        <Bar light title="Before you generate" />
        <div style={{ padding: "30px 34px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 25,
              marginBottom: 25,
            }}
          >
            <span>Estimated cost</span>
            <strong style={{ color: C.accent }}>By model & settings</strong>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 25,
              paddingTop: 24,
              borderTop: "1px solid #DAE8F0",
            }}
          >
            <span>Temporary authorization</span>
            <strong style={{ color: C.accent }}>Shown before creation</strong>
          </div>
          <div
            style={{
              fontSize: 23,
              lineHeight: 1.6,
              color: "#58717F",
              marginTop: 27,
            }}
          >
            Final charge follows completed provider cost.
            <br />
            Unused authorization is released.
          </div>
        </div>
      </Panel>
      <Tag
        light
        style={{
          position: "absolute",
          left: 72,
          top: 1470,
          opacity: anim(f, 170, 200),
        }}
      >
        Estimate → Authorize → Create
      </Tag>
      <SampleNote
        light
        top={1565}
        text="Current credit policy · illustrative media estimate interface"
      />
    </Stage>
  );
};
