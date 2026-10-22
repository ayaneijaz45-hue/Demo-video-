import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import assert from "node:assert/strict";
assert.equal(process.env.GITHUB_ACTIONS, "true", "No local video exports");
assert.equal(process.env.RUNNER_ENVIRONMENT, "github-hosted");
assert.equal(process.env.GITHUB_REPOSITORY, "ayaneijaz45-hue/Demo-video-");
const mode = process.env.REVEAL_MODE || "proof";
const started = Date.now();
const asset = JSON.parse(
  readFileSync("production/first-reveal/audio-assets.json", "utf8"),
);
mkdirSync("out/first-reveal", { recursive: true });
const cli = "node_modules/@remotion/cli/remotion-cli.js";
const run = (args) => {
  const x = spawnSync(process.execPath, [cli, ...args], { stdio: "inherit" });
  assert.equal(x.status, 0, args.join(" "));
};
const base = ["src/index.ts", "ModelsSuiteFirstReveal"];
const opts = [
  "--gl=swangle",
  "--concurrency=1",
  "--codec=h264",
  "--crf=17",
  "--pixel-format=yuv420p",
  "--timeout=120000",
];
if (mode === "logo-polish") {
  run([
    "render", ...base, "out/first-reveal/LOGO-POLISH-PROOF-SILENT.mp4",
    "--frames=90-149", "--muted", ...opts,
  ]);
  for (const frame of [135, 267, 570, 620, 855, 888])
    run([
      "still", ...base, `out/first-reveal/frame-${frame}.png`,
      `--frame=${frame}`, "--gl=swangle", "--timeout=120000",
    ]);
} else if (mode === "proof") {
  const clips = [
    ["01-tab-storm", 0, 89],
    ["02-brand-object", 90, 134],
    ["03-model-battle", 360, 434],
    ["04-creation-morph", 450, 659],
  ];
  for (const [name, a, b] of clips)
    run([
      "render",
      ...base,
      `out/first-reveal/${name}-SILENT.mp4`,
      `--frames=${a}-${b}`,
      ...opts,
    ]);
  for (const frame of [12, 60, 135, 255, 414, 510, 570, 630, 720, 855])
    run([
      "still",
      ...base,
      `out/first-reveal/frame-${frame}.png`,
      `--frame=${frame}`,
      "--gl=swangle",
      "--timeout=120000",
    ]);
} else if (mode === "refine") {
  for (const [name, a, b] of [
    ["01-tab-storm", 0, 89],
    ["02-brand-object", 90, 134],
    ["04-creation-morph", 450, 659],
  ])
    run([
      "render",
      ...base,
      `out/first-reveal/${name}-SILENT.mp4`,
      `--frames=${a}-${b}`,
      ...opts,
    ]);
  for (const frame of [12, 60, 135, 510, 570, 630, 855])
    run([
      "still",
      ...base,
      `out/first-reveal/frame-${frame}.png`,
      `--frame=${frame}`,
      "--gl=swangle",
      "--timeout=120000",
    ]);
  run([
    "render",
    ...base,
    "out/first-reveal/brand-60fps-SILENT.mp4",
    "--frames=204-263",
    '--props={"targetFps":60,"narrationFile":null,"musicFile":null,"sfxFile":null}',
    ...opts,
  ]);
} else if (mode === "proof60") {
  run([
    "render",
    ...base,
    "out/first-reveal/brand-60fps-SILENT.mp4",
    "--frames=204-263",
    '--props={"targetFps":60,"narrationFile":null,"musicFile":null,"sfxFile":null}',
    ...opts,
  ]);
} else if (mode === "master") {
  assert.ok(
    asset.narration.path && asset.narration.timingInspected,
    "Supply and inspect Runway narration first",
  );
  assert.ok(
    asset.music.approved && asset.music.licenseEvidence,
    "Approved licensed music required",
  );
  assert.ok(
    asset.sfxStem.approved && asset.sfxStem.licenseEvidence,
    "Approved licensed SFX required",
  );
  assert.ok(
    asset.approvedMix.approved &&
      asset.approvedMix.path &&
      asset.finalExportApproved,
    "Approved final mix and export authorization required",
  );
  assert.ok(existsSync("public/" + asset.approvedMix.path));
  throw new Error(
    "Final voice-integrated mastering/export must be conformed and reviewed once audio is supplied. No premature master is produced by the visual-proof workflow.",
  );
} else throw new Error("Unknown mode");
writeFileSync(
  "out/first-reveal/run-report.json",
  JSON.stringify(
    {
      mode,
      commit: process.env.GITHUB_SHA,
      runId: process.env.GITHUB_RUN_ID,
      elapsedSeconds: (Date.now() - started) / 1000,
      renderer: "GitHub-hosted Ubuntu CPU / swangle / concurrency 1",
      audio: "SILENT VISUAL PROOFS — approved soundtrack intentionally excluded",
      full30SecondMaster: "NOT EXPORTED",
      audioInspected: asset.narration.timingInspected,
    },
    null,
    2,
  ),
);
