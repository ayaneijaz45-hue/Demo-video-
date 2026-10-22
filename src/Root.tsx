import { Composition, Folder } from "remotion";
import { Film } from "./Film";
import { Hook } from "./scenes/Hook";
import { Reveal } from "./scenes/Reveal";
import { Intelligence } from "./scenes/Intelligence";
import { Battle } from "./scenes/Battle";
import { Creation } from "./scenes/Creation";
import { Pricing } from "./scenes/Pricing";
import { Localization } from "./scenes/Localization";
import { Finale } from "./scenes/Finale";
import { FirstRevealRegistrations } from "./first-reveal/Registration";

export const RemotionRoot = () => (
  <>
    <FirstRevealRegistrations />
    <Composition
      id="ModelsSuite"
      component={Film}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1800}
      defaultProps={{voiceoverFile: null}}
    />
    <Folder name="Scenes">
      <Composition
        id="Hook"
        component={Hook}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={150}
      />
      <Composition
        id="Reveal"
        component={Reveal}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={210}
      />
      <Composition
        id="Intelligence"
        component={Intelligence}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={240}
      />
      <Composition
        id="Battle"
        component={Battle}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={240}
      />
      <Composition
        id="Creation"
        component={Creation}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={360}
      />
      <Composition
        id="Pricing"
        component={Pricing}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={240}
      />
      <Composition
        id="Localization"
        component={Localization}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={180}
      />
      <Composition
        id="Finale"
        component={Finale}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={180}
      />
    </Folder>
  </>
);
