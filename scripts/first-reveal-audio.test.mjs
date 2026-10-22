import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { assetPath, validateConfig, buildMixArgs } from "./first-reveal-audio.mjs";
const c = JSON.parse(readFileSync("production/first-reveal/audio-integration.json", "utf8"));
test("approved timeline, original voice speed and no source-path escape", () => {
  validateConfig(c);
  for (const path of ["../voice.mp3", "/tmp/voice.mp3", "C:\\voice.mp3", "sfx/../../voice.wav"])
    assert.throws(() => assetPath("production/first-reveal/audio-assets", path));
  assert.equal(assetPath("production/first-reveal/audio-assets", c.narration.path), resolve("production/first-reveal/audio-assets/narration/runway-original.mp3"));
  const altered = structuredClone(c); altered.narration.playbackRate = 1.01;
  assert.throws(() => validateConfig(altered));
});
test("draft graph uses eleven core cues, no old score and no speech time/fade processing", () => {
  const draft = structuredClone(c); draft.music.trimStartSeconds = 0;
  const args = buildMixArgs(draft, "production/first-reveal/audio-assets", "out/unused.wav");
  const graph = args[args.indexOf("-filter_complex") + 1];
  assert.equal(c.cues.filter((x) => x.enabled).length, 11);
  assert.equal(args.filter((x) => x === "-i").length, 13); // voice + music + 11 core placements
  assert.ok(graph.includes("amix=inputs=13"));
  const voice = graph.split(";")[0];
  assert.ok(!/atempo|rubberband|afade|atrim=start/.test(voice));
  assert.ok(!args.join(" ").includes("public/audio/"));
  assert.ok(!args.join(" ").includes("approved-stereo.wav"));
});
test("media modes refuse local execution before creating any media", () => {
  for (const mode of ["mix-review", "master"]) {
    const r = spawnSync(process.execPath, ["scripts/first-reveal-audio.mjs", mode], { encoding: "utf8", env: { ...process.env, GITHUB_ACTIONS: "false" } });
    assert.notEqual(r.status, 0);
    assert.match(r.stderr, /GitHub cloud-only/);
  }
});
