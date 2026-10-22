import { AbsoluteFill, Sequence, useVideoConfig, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TabStorm } from "./scenes/TabStorm";
import { BrandReveal } from "./scenes/BrandReveal";
import { IntelligenceReveal } from "./scenes/Intelligence";
import { BattleReveal } from "./scenes/ModelBattle";
import { CreationMorph } from "./scenes/CreationMorph";
import { WalletReveal } from "./scenes/Wallet";
import { FirstFinale } from "./scenes/Finale";
import { P } from "./design";

export type FirstRevealProps = {
  targetFps: number;
  narrationFile: string | null;
  musicFile: string | null;
  sfxFile: string | null;
};
export const FirstReveal = ({
  narrationFile,
  musicFile,
  sfxFile,
}: FirstRevealProps) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: P.ink }}>
      <Sequence
        name="01 Tab storm"
        from={0}
        durationInFrames={3 * fps}
        premountFor={fps}
      >
        <TabStorm />
      </Sequence>
      <Sequence
        name="02 Brand object"
        from={3 * fps}
        durationInFrames={3 * fps}
        premountFor={fps}
      >
        <BrandReveal />
      </Sequence>
      <Sequence
        name="03 Connected intelligence"
        from={6 * fps}
        durationInFrames={5 * fps}
        premountFor={fps}
      >
        <IntelligenceReveal />
      </Sequence>
      <Sequence
        name="04 Compare and choose"
        from={11 * fps}
        durationInFrames={4 * fps}
        premountFor={fps}
      >
        <BattleReveal />
      </Sequence>
      <Sequence
        name="05 Creative transformation"
        from={15 * fps}
        durationInFrames={7 * fps}
        premountFor={fps}
      >
        <CreationMorph />
      </Sequence>
      <Sequence
        name="06 PKR wallet"
        from={22 * fps}
        durationInFrames={4 * fps}
        premountFor={fps}
      >
        <WalletReveal />
      </Sequence>
      <Sequence
        name="07 First reveal finale"
        from={26 * fps}
        durationInFrames={4 * fps}
        premountFor={fps}
      >
        <FirstFinale />
      </Sequence>
      {narrationFile ? (
        <Audio
          name="Supplied Runway narration — original speed"
          src={staticFile(narrationFile)}
          playbackRate={1}
          premountFor={fps}
        />
      ) : null}
      {musicFile ? (
        <Audio
          name="Licensed cinematic music"
          src={staticFile(musicFile)}
          volume={0.2}
          premountFor={fps}
        />
      ) : null}
      {sfxFile ? (
        <Audio
          name="Approved external SFX stem"
          src={staticFile(sfxFile)}
          volume={0.5}
          premountFor={fps}
        />
      ) : null}
    </AbsoluteFill>
  );
};
