import { Composition, Folder } from "remotion";
import { FirstReveal } from "./FirstReveal";
import { TabStorm } from "./scenes/TabStorm";
import { BrandReveal } from "./scenes/BrandReveal";
import { IntelligenceReveal } from "./scenes/Intelligence";
import { BattleReveal } from "./scenes/ModelBattle";
import { CreationMorph } from "./scenes/CreationMorph";
import { WalletReveal } from "./scenes/Wallet";
import { FirstFinale } from "./scenes/Finale";

export const FirstRevealRegistrations = () => (
  <Folder name="First-Reveal">
    <Composition
      id="ModelsSuiteFirstReveal"
      component={FirstReveal}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={900}
      defaultProps={{
        targetFps: 30,
        narrationFile: null,
        musicFile: null,
        sfxFile: null,
      }}
      calculateMetadata={({ props }) => {
        if (![30, 60].includes(props.targetFps))
          throw new Error("Use 30 or 60 FPS");
        return { fps: props.targetFps, durationInFrames: props.targetFps * 30 };
      }}
    />
    <Composition
      id="FirstRevealHook"
      component={TabStorm}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={90}
    />
    <Composition
      id="FirstRevealBrand"
      component={BrandReveal}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={90}
    />
    <Composition
      id="FirstRevealIntelligence"
      component={IntelligenceReveal}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={150}
    />
    <Composition
      id="FirstRevealBattle"
      component={BattleReveal}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={120}
    />
    <Composition
      id="FirstRevealCreation"
      component={CreationMorph}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={210}
    />
    <Composition
      id="FirstRevealWallet"
      component={WalletReveal}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={120}
    />
    <Composition
      id="FirstRevealFinale"
      component={FirstFinale}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={120}
    />
  </Folder>
);
