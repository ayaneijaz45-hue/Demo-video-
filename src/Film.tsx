import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { Audio } from "@remotion/media";
import { Battle } from "./scenes/Battle";
import { Creation } from "./scenes/Creation";
import { Finale } from "./scenes/Finale";
import { Hook } from "./scenes/Hook";
import { Intelligence } from "./scenes/Intelligence";
import { Localization } from "./scenes/Localization";
import { Pricing } from "./scenes/Pricing";
import { Reveal } from "./scenes/Reveal";
import { C, anim } from "./design";

const Seam = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        transform: `translateX(${interpolate(f, [0, 8, 16], [-110, 0, 110])}%) skewX(-12deg)`,
        background: `linear-gradient(90deg,${C.cyan},${C.light})`,
        boxShadow: "0 0 70px #7EE7FF55",
      }}
    />
  );
};
type FilmProps = {voiceoverFile: string | null};

export const Film = ({voiceoverFile = null}: FilmProps) => {
  const { fps } = useVideoConfig();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="01 Hook"
          durationInFrames={5 * fps}
          premountFor={fps}
        >
          <Hook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="02 Reveal"
          durationInFrames={7 * fps}
          premountFor={fps}
        >
          <Reveal />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="03 Intelligence"
          durationInFrames={8 * fps}
          premountFor={fps}
        >
          <Intelligence />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="04 Model Battle"
          durationInFrames={8 * fps}
          premountFor={fps}
        >
          <Battle />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="05 Creation"
          durationInFrames={12 * fps}
          premountFor={fps}
        >
          <Creation />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="06 Credits"
          durationInFrames={8 * fps}
          premountFor={fps}
        >
          <Pricing />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="07 Pakistan"
          durationInFrames={6 * fps}
          premountFor={fps}
        >
          <Localization />
        </TransitionSeries.Sequence>
        <TransitionSeries.Sequence
          name="08 Finale"
          durationInFrames={6 * fps}
          premountFor={fps}
        >
          <Finale />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Sequence
        name="Hook → Reveal"
        from={5 * fps - 8}
        durationInFrames={17}
        premountFor={fps}
      >
        <Seam />
      </Sequence>
      <Sequence
        name="Reveal → Intelligence"
        from={12 * fps - 8}
        durationInFrames={17}
        premountFor={fps}
      >
        <Seam />
      </Sequence>
      <Sequence
        name="Intelligence → Battle"
        from={20 * fps - 8}
        durationInFrames={17}
        premountFor={fps}
      >
        <Seam />
      </Sequence>
      <Sequence
        name="Battle → Creation"
        from={28 * fps - 8}
        durationInFrames={17}
        premountFor={fps}
      >
        <Seam />
      </Sequence>
      <Sequence
        name="Creation → Credits"
        from={40 * fps - 8}
        durationInFrames={17}
        premountFor={fps}
      >
        <Seam />
      </Sequence>
      <Sequence
        name="Credits → Pakistan"
        from={48 * fps - 8}
        durationInFrames={17}
        premountFor={fps}
      >
        <Seam />
      </Sequence>
      <Sequence
        name="Pakistan → Finale"
        from={54 * fps - 8}
        durationInFrames={17}
        premountFor={fps}
      >
        <Seam />
      </Sequence>
      <Audio
        name="Original music — narration space reserved"
        src={staticFile("audio/one-workspace-score.wav")}
        premountFor={fps}
        volume={0.85}
      />
      <Audio
        name="Synchronized original sound design"
        src={staticFile("audio/one-workspace-fx.wav")}
        premountFor={fps}
        volume={0.65}
      />
      {voiceoverFile ? (
        <Audio
          name="Approved professional narration — aligned 60-second track"
          src={staticFile(voiceoverFile)}
          durationInFrames={60 * fps}
          premountFor={fps}
          volume={1}
        />
      ) : null}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "black",
          opacity: anim(f, 1782, 1799),
        }}
      />
    </AbsoluteFill>
  );
};
